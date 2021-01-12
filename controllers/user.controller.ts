import * as jwt from "jsonwebtoken";
import * as validate from "validate.js";
import { async } from "validate.js";
import config from "../config/index";
import PhoneFormat from "../helpers/phone.format";
import {
  comparePassword,
  emailVerifyOtp,
  errRes,
  getOTP,
  hashMyPassword,
  okRes,
  sendSMS,
} from "../helpers/tools";
import validator from "../helpers/validate";
import { Contact } from "../src/entity/contact";
import { ContactsList } from "../src/entity/contactsList";
import { Otp } from "../src/entity/otp";
import { Plan } from "../src/entity/plan";
import { SettingsChange } from "../src/entity/settingsChange";
import { User } from "../src/entity/User";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default class UserController {
  static register = async (req, res) => {
    let user;
    let settings = await SettingsChange.findOne({ where: { active: true } });
    let body = req.body;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    let otp;
    let link;
    let password;
    let plan;
    let secretCode;
    let email;
    let notValid = validate(body, validator.register());

    if (notValid) return errRes(res, notValid);
    if (body.phone == false && body.email == false)
      return errRes(res, `Please provide an email or a phone number`);
    email = await User.findOne({
      where: { email: body.email },
    });
    if (email) return errRes(res, `This email already exists`);
    password = await hashMyPassword(body.password);
    plan = await Plan.findOne({
      where: { price: "free" },
    });
    user = await User.create({
      ...body,
      plan,
      password,
      planType: plan.type,
      verified: false,
      active: true,
      emailsLeft: 50,
    });
    await user.save();
    secretCode = await getOTP();
    const token = jwt.sign({ id: user.id, otp: true }, process.env.JWT_SECRET);
    otp = await Otp.create({
      expired: false,
      expiry,
      code: secretCode,
      used: false,
      type: `Register`,
      user,
    });
    await otp.save();
    if (user.email) {
      email = user.email;
      link = `http://localhost:3000/v1/verify?token=${token}`;
      emailVerifyOtp(email, secretCode, `Registration`, link);
      return okRes(res, {
        data: `An email with the verification link has been sent to your address`,
        user,
      });
    }
    if (user.phone) {
      sendSMS(`Your otp for registration is ${secretCode}`, user.phone);
    }
  };

  static verify = async (req, res) => {
    let otp;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let user = req.user;
    let body = req.body;
    let notValid = validate(body, validator.verify());
    if (notValid) return errRes(res, notValid);
    console.log(`true`);

    otp = await Otp.findOne({ where: { used: false, expired: false, user } });
    if (!otp) return errRes(res, `No OTP found`);
    if (minutesNow - otp.expiry > 4) {
      otp.expired = true;
      await otp.save();
      return errRes(
        res,
        `This otp has expired, another one has been sent to your email account`
      );
    }
    if (body.otp != otp.code) return errRes(res, `Wrong OTP`);
    otp.used = true;
    await otp.save();
    user.verified = true;
    await user.save();
    return okRes(res, `Successfully verified`, user);
  };

  static login = async (req, res) => {
    let body = req.body;
    let otp;
    let secretCode;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    let user;
    let email;
    let token;
    let notValid = validate(body, validator.login());
    if (notValid) return errRes(res, notValid);

    user = await User.findOne({
      where: { email: body.email, verified: true, active: true },
    });
    if (!user) errRes(res, `No user found`);
    if (body.password) {
      let validPassword = comparePassword(body.password, user.password);
      if (!validPassword) return errRes(res, `Password is incorrect`);
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return okRes(res, { token, user });
    }

    otp = await Otp.findOne({
      where: { used: false, expired: false, user: user, type: "Login" },
    });
    if (otp) return errRes(res, `You already have an active OTP`);
    secretCode = await getOTP();
    otp = await Otp.create({
      expired: false,
      code: secretCode,
      expiry,
      used: false,
      type: `Login`,
      user,
    });
    await otp.save();
    token = jwt.sign({ id: user.id, otp: true }, config.jwtSecret);

    email = user.email;
    let link = `https://solo-bolt.herokuapp.com/v1/login/otp/${user.id}?token=${token}`;
    emailVerifyOtp(email, secretCode, `login`, link);

    return okRes(
      res,
      `An otp with the login verification link has been sent to your email`
    );
  };

  static loginOtp = async (req, res) => {
    let otp;
    let token;
    let secretCode;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    let user = req.user;
    let body = req.body;
    let notValid = validate(body, validator.verify());
    if (notValid) return errRes(res, notValid);

    otp = await Otp.findOne({
      where: { used: false, expired: false, type: "Login", user },
    });
    if (!otp) errRes(res, `No active OTP found`);

    if (minutesNow - otp.expiry > 4) {
      otp.expired = true;
      await otp.save();
      secretCode = getOTP();
      otp = await Otp.create({
        expired: false,
        code: secretCode,
        used: false,
        type: `Login`,
        expiry,
        user,
      });
      await otp.save();
      let link = `https://solo-bolt.herokuapp.com/v1/email/verify`;
      emailVerifyOtp(body.newEmail, secretCode, `change your email`, link);

      return errRes(
        res,
        `This otp has expired, another one has been sent to your email account`
      );
    }
    if (body.otp != otp.code) return errRes(res, `Wrong OTP`);
    otp.used = true;
    await otp.save();
    token = jwt.sign({ id: user.id }, config.jwtSecret);

    return okRes(res, { token, user });
  };

  static changeEmail = async (req, res) => {
    let secretCode;
    let otp;
    let exists;
    let user;
    let token;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    user = req.user;
    let body = req.body;
    let notValid = validate(body, validator.changeEmail());
    if (notValid) errRes(res, notValid);
    exists = await User.findOne({
      where: { email: body.newEmail, active: true },
    });
    if (exists) errRes(res, `A user with that email already exists`);
    secretCode = await getOTP();
    otp = await Otp.create({
      expired: false,
      code: secretCode,
      used: false,
      type: `ResetEmail`,
      user,
      expiry,
    });
    await otp.save();

    token = jwt.sign(
      { id: user.id, newEmail: body.newEmail, otp: true },
      config.jwtSecret
    );

    let link = `https://solo-bolt.herokuapp.com/v1/email/verify?token=${token}`;
    await emailVerifyOtp(body.newEmail, secretCode, `reset your email`, link);
    okRes(res, `An email reset OTP has been sent to your new email address`);
  };

  static verifyEmail = async (req, res) => {
    let otp;
    let payload = req.payload;
    let d = new Date();
    let token;
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    let user = req.user;
    let password;
    let secretCode;
    let body = req.body;
    let notValid = validate(body, validator.verifyNewEmail());
    if (notValid) return errRes(res, notValid);
    console.log(payload.newEmail);

    if (payload.newEmail !== body.newEmail)
      return errRes(
        res,
        `The email you provided doesn't match with the original email`
      );
    otp = await Otp.findOne({
      where: { used: false, expired: false, type: "ResetEmail", user },
    });
    console.log(otp);

    if (!otp) errRes(res, `No active OTP found`);
    console.log(minutesNow);
    console.log(otp.expiry);

    console.log(minutesNow - otp.expiry);

    if (minutesNow - otp.expiry > 4) {
      otp.expired = true;
      secretCode = await getOTP();
      await otp.save();
      secretCode = getOTP();
      otp = await Otp.create({
        expired: false,
        code: secretCode,
        used: false,
        type: `ResetEmail`,
        user,
        expiry,
      });
      await otp.save();
      token = jwt.sign(
        { id: user.id, newEmail: payload.newEmail, otp: true },
        config.jwtSecret
      );
      let link = `https://solo-bolt.herokuapp.com/v1/email/verify?token=${token}`;
      emailVerifyOtp(body.newEmail, secretCode, `changing your email`, link);
      return errRes(
        res,
        `This otp has expired, another one has been sent to your email account`
      );
    }
    if (body.otp != otp.code) return errRes(res, `Wrong OTP`);
    otp.used = true;
    await otp.save();
    password = await hashMyPassword(body.newPassword);
    user.email = body.newEmail;
    user.password = password;
    await user.save();
    return okRes(res, { user });
  };

  static changePassword = async (req, res) => {
    let secretCode;
    let otp;
    let token;
    let user;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    user = req.user;
    let body = req.body;
    secretCode = await getOTP();
    otp = await Otp.create({
      expired: false,
      code: secretCode,
      used: false,
      type: `ResetPassword`,
      user,
      expiry,
    });
    await otp.save();
    token = jwt.sign({ id: user.id, otp: true }, config.jwtSecret);
    let link = `https://solo-bolt.herokuapp.com/v1/password/verify?token=${token}`;
    emailVerifyOtp(user.email, secretCode, `reset your password`, link);
    okRes(res, `A password reset OTP has been sent to your email address`);
  };

  static resetPassword = async (req, res) => {
    let otp;
    let d = new Date();
    let minutesNow = Math.round(d.getTime() / 1000 / 60);
    let expiry = minutesNow + 4;
    let user = req.user;
    let token;
    let password;
    let secretCode;
    let body = req.body;
    let notValid = validate(body, validator.changePassword());
    if (notValid) return errRes(res, notValid);

    otp = await Otp.findOne({
      where: { used: false, expired: false, type: "ResetPassword", user },
    });
    if (!otp) errRes(res, `No active OTP found`);

    if (minutesNow - otp.expiry > 4) {
      otp.expired = true;
      secretCode = await getOTP();
      await otp.save();
      secretCode = getOTP();
      otp = await Otp.create({
        expired: false,
        code: secretCode,
        used: false,
        type: `ResetPassword`,
        user,
        expiry,
      });
      await otp.save();
      token = jwt.sign({ id: user.id, otp: true }, config.jwtSecret);
      let link = `https://solo-bolt.herokuapp.com/v1/password/verify?token=${token}`;
      emailVerifyOtp(user.email, secretCode, `change your password`, link);
      return errRes(
        res,
        `This otp has expired, another one has been sent to your email account`
      );
    }

    if (body.otp != otp.code) return errRes(res, `Wrong OTP`);
    otp.used = true;
    await otp.save();
    password = await hashMyPassword(body.newPassword);
    user.password = password;
    await user.save();
    return okRes(res, { user });
  };

  static createContact = async (req, res) => {
    let body = req.body;
    let contact;
    let group = [];
    let user = req.user;
    let notValid = validate(body, validator.createContact());
    if (notValid) return errRes(res, notValid);
    if (body.contact.length == 0)
      return errRes(res, `Please provide a contact to add`);
    for (let obj of body.contact) {
      if (!obj.email) return errRes(res, `Contact must have an email`);
      contact = await Contact.findOne({ where: { user, email: obj.email } });
      if (contact)
        return errRes(res, `This contact with ${obj.email} already exists`);
      contact = await Contact.create({
        user,
        active: true,
        firstName: obj.firstName,
        lastName: obj.lastName,
        email: obj.email,
      }).save();
      group.push(contact);
    }

    return okRes(res, group);
  };

  static createList = async (req, res) => {
    let body = req.body;
    let contact;
    let list;
    let contactsList = [];
    let user = req.user;
    let notValid = validate(body, validator.createList());
    if (notValid) return errRes(res, notValid);
    if (body.contact.length == 0)
      return errRes(res, `Please provide a contact to add`);
    list = await ContactsList.create({
      name: body.name,
      unsubscribers: "0%",
      active: true,
      opens: "0%",
      user,
      subscribers: 0,
    }).save();

    for (let x = 0; x < body.contact.length; x++) {
      let mail = body.contact[x].email;
      if (!body.contact[x].email)
        return errRes(res, `Contact must have an email`);

      for (let i = x + 1; i < body.contact.length; i++) {
        let dup = body.contact[i].email;
        if (dup === mail)
          return errRes(
            res,
            `Emails must be unique, ${dup} already exists in the provided file`
          );
      }

      contact = await Contact.create({
        contactList: list,
        active: true,
        firstName: body.contact[x].firstName,
        lastName: body.contact[x].lastName,
        email: body.contact[x].email,
        user,
      }).save();
      contactsList.push(contact);
      list.subscribers = list.subscribers + 1;
      await list.save();
    }

    return okRes(res, { list: contactsList });
  };

  static addToList = async (req, res) => {
    let body = req.body;
    let contact;
    let list;
    let listId = req.params.listId;
    let contactsList = [];
    let user = req.user;
    let notValid = validate(body, validator.createContact());
    if (notValid) return errRes(res, notValid);
    if (body.contact.length == 0)
      return errRes(res, `Please provide a contact to add`);

    list = await ContactsList.findOne({ where: { user, id: listId } });
    if (!list) return errRes(res, `No list found`);
    for (let x=0; x< body.contact.length; x++) {
      if (!body.contact[x].email) return errRes(res, `Contact must have an email`);
      contact = await Contact.findOne({
        where: { contactList: list, email: body.contact[x].email },
      });
      if (contact)
        return errRes(
          res,
          `The contact with the email of ${body.contact[x].email} already exists in this list`
        );
      
        for (let i = x + 1; i < body.contact.length; i++) {
            let dup = body.contact[i].email;
            if (dup === body.contact[x].email)
              return errRes(
                res,
                `Emails must be unique, ${dup} already exists in the file you provided`
              );
          }
      contact = await Contact.create({
        contactList: list,
        active: true,
        user,
        firstName: body.contact[x].firstName,
        lastName: body.contact[x].lastName,
        email: body.contact[x].email,
      }).save();
      contactsList.push(contact);
      list.subscribers = list.subscribers + 1;
      await list.save();
    }

    return okRes(res, list);
  };

  static deleteList = async (req, res) => {
    let listId = req.params.listId;
    let list;
    let user = req.user;
    list = await ContactsList.findOne({ where: { user, id: listId } });
    if (!list) return errRes(res, `No list found`);

    list.active = false;
    await list.save();

    return okRes(res, `List deleted successfully`);
  };

  static deleteContact = async (req, res) => {
    let listContacts;
    let body = req.body;
    let user = req.user;
    let notValid = validate(body, validator.deleteContactFromList());
    if (notValid) return errRes(res, notValid);

    listContacts = await Contact.findByIds(body.contactIds);
    if (!listContacts) return errRes(res, `No contacts found`);

    for (let contact of listContacts) {
      contact.active = false;
      await contact.save();
    }

    return okRes(res, `Contact deleted successfully`);
  };
}
