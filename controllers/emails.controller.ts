import { error } from "console";
import * as jwt from "jsonwebtoken";
import * as validate from "validate.js";
import { async } from "validate.js";
let CronJobManager = require("cron-job-manager");
import config from "../config/index";
import PhoneFormat from "../helpers/phone.format";
var schedule = require("node-schedule");

import {
  comparePassword,
  emailVerifyOtp,
  errRes,
  getOTP,
  hashMyPassword,
  okRes,
  sendMail,
  sendSMS,
} from "../helpers/tools";
import validator from "../helpers/validate";
import { Contact } from "../src/entity/contact";
import { ContactsList } from "../src/entity/contactsList";
import { Otp } from "../src/entity/otp";
import { Plan } from "../src/entity/plan";
import { ScheduledMail } from "../src/entity/scheduled";
import { SentEmail } from "../src/entity/sentEmail";
const Bree = require("bree");

export default class EmailsController {
  static sendEmail = async (req, res) => {
    let user = req.user;
    let contactsArray = [];
    let listsArray = [];
    let body = req.body;
    let emails = body.emails;
    let listIds = body.listIds;
    let contactIds = body.contactIds;
    if(emails==null&&listIds==null&&contactIds==null) return errRes(res, `Please specify emails to send to!`)
    let sentEmail;
    if (user.exceededDailyLimit)
      return errRes(res, `You've exceeded your daily sending limit!`);
    let notValid = validate(body, validator.sendMail());
    if (notValid) return errRes(res, notValid);
    let remainingSends;
    if (body.emails.length == 0)
      return errRes(res, `Please provide emails to send to`);
    if (contactIds) {
      for (let contactId of contactIds) {
        let contact = await Contact.findOne({ where: { user, id: contactId } });
        if (!contact) return errRes(res, `No contact found`);
        contactsArray.push(contact);
        emails.push(contact.email);
      }
    }
    if (listIds) {
      for (let listId of listIds) {
        let list = await ContactsList.findOne({ where: { user, id: listId } });
        if (!list) return errRes(res, `No list found`);
        listsArray.push(list);

        let contacts = await Contact.find({
          where: { user, contactList: list },
        });

        for (let contact of contacts) {
          emails.push(contact.email);
        }
      }
    }
    for (let address of body.emails) {
      if (typeof address != "string")
        return errRes(res, `Please provide the emails as strings`);
    }
    let amountOfEmails = emails.length;

    remainingSends = user.emailsLeft - amountOfEmails;
    if (remainingSends < 0)
      return errRes(
        res,
        `Insufficient email sends, please buy more email sends`
      );
    for (let i = 0; i < emails.length; i++) {
      for (let x = i + 1; x < emails.length; x++) {
        if (emails[i] === emails[x])
          return errRes(
            res,
            `Emails must be unique, ${emails[i]} already exists in a list or is a duplicate`
          );
      }
    }
    [
      { to: [{ email: "recipient1@example.com" }] },
      { to: [{ email: "recipient2@example.com" }] },
    ];
    let arr = [];
    for (let mail of emails) {
      arr.push({ to: mail });
    }
    emails = arr;

    if (emails.length > user.dailyLimit - user.emailsSentToday)
      return errRes(
        res,
        `You will surpass your daily limit by sending this many emails, you have ${
          user.dailyLimit - user.emailsSentToday
        } sends left for today`
      );

    if (emails.length - (user.dailyLimit - user.emailsSentToday) == 0) {
      user.exceededDailyLimit = true;
      await user.save();
    }

    await sendMail(emails, body.body, body.subject, req, res)

    user.emailsSentToday += emails.length;
    await user.save();
    if (listsArray && contactsArray) {
      for (let list of listsArray) {
        sentEmail = await SentEmail.create({
          subject: body.subject,
          body: body.body,
          user,
          contactsList: list,
        }).save();
      }
      for (let contact of contactsArray) {
        sentEmail = await SentEmail.create({
          subject: body.subject,
          body: body.body,
          user,
          contact,
        }).save();
      }
    } else if (listsArray) {
      for (let list of listsArray) {
        sentEmail = await SentEmail.create({
          subject: body.subject,
          body: body.body,
          user,
          contactsList: list,
        }).save();
      }
    } else if (contactsArray) {
      for (let contact of contactsArray) {
        sentEmail = await SentEmail.create({
          subject: body.subject,
          body: body.body,
          user,
          contact,
        }).save();
      }
    } else {
      sentEmail = await SentEmail.create({
        subject: body.subject,
        body: body.body,
        user,
      }).save();
    }

    user.emailsLeft = remainingSends;
    await user.save();
    return okRes(res, `Email sent successfully`);
  };

  static sendScheduledEmail = async (req, res) => {
    let user = req.user;
    let contactsArray = [];
    let listsArray = [];
    let body = req.body;
    let emails = body.emails;
    let listIds = body.listIds;
    let contactIds = body.contactIds;
    if(emails==null&&listIds==null&&contactIds==null) return errRes(res, `Please specify emails to send to!`)
    let sentEmail;
    let notValid = validate(body, validator.sendScheduledMail());
    if (notValid) return errRes(res, notValid);
    let remainingSends;
    if (body.emails.length == 0)
      return errRes(res, `Please provide emails to send to`);
    if (contactIds) {
      for (let contactId of contactIds) {
        let contact = await Contact.findOne({ where: { user, id: contactId } });
        if (!contact) return errRes(res, `No contact found`);
        contactsArray.push(contact);
        emails.push(contact.email);
      }
    }
    if (listIds) {
      for (let listId of listIds) {
        let list = await ContactsList.findOne({ where: { user, id: listId } });
        if (!list) return errRes(res, `No list found`);
        listsArray.push(list);

        let contacts = await Contact.find({
          where: { user, contactList: list },
        });

        for (let contact of contacts) {
          emails.push(contact.email);
        }
      }
    }
    for (let address of body.emails) {
      if (typeof address != "string")
        return errRes(res, `Please provide the emails as strings`);
    }
    let amountOfEmails = emails.length;

    remainingSends = user.emailsLeft - amountOfEmails;
    if (remainingSends < 0)
      return errRes(
        res,
        `Insufficient email sends, please buy more email sends`
      );
    for (let i = 0; i < emails.length; i++) {
      for (let x = i + 1; x < emails.length; x++) {
        if (emails[i] === emails[x])
          return errRes(
            res,
            `Emails must be unique, ${emails[i]} already exists in a list or is a duplicate`
          );
      }
    }
    [
      { to: [{ email: "recipient1@example.com" }] },
      { to: [{ email: "recipient2@example.com" }] },
    ];
    let arr = [];
    for (let mail of emails) {
      arr.push({ to: mail });
    }
    emails = arr;

    if (emails.length > user.dailyLimit - user.emailsSentToday)
      return errRes(
        res,
        `You will surpass your daily limit by sending this many emails, you have ${
          user.dailyLimit - user.emailsSentToday
        } sends left for today`
      );

    if (emails.length - (user.dailyLimit - user.emailsSentToday) == 0) {
      user.exceededDailyLimit = true;
      await user.save();}

    let dateToRun = new Date(body.timeStamp);
    let exists = await ScheduledMail.findOne({
      where: { user, taskName: body.name, active: true },
    });
    if (exists)
      return errRes(res, `This name already exists for a scheduled task`);
    let scheduled = await ScheduledMail.create({
      user,
      taskName: body.name,
      active: true,
      scheduledAt: dateToRun,
    }).save();
    schedule.scheduleJob(body.name, dateToRun, async () => {
      await sendMail(emails, body.body, body.subject, req, res);
      user.emailsSentToday += emails.length;
      await user.save();
      scheduled.active = false;
      scheduled.save();
      if (listsArray && contactsArray) {
        for (let list of listsArray) {
          sentEmail = await SentEmail.create({
            subject: body.subject,
            body: body.body,
            user,
            contactsList: list,
            scheduledAt: dateToRun,
            taskName: body.name,
            active: true,
          }).save();
        }
        for (let contact of contactsArray) {
          sentEmail = await SentEmail.create({
            subject: body.subject,
            body: body.body,
            user,
            contact,
            scheduledAt: dateToRun,
            taskName: body.name,
            active: true,
          }).save();
        }
      } else if (listsArray) {
        for (let list of listsArray) {
          sentEmail = await SentEmail.create({
            subject: body.subject,
            body: body.body,
            user,
            contactsList: list,
            scheduledAt: dateToRun,
            taskName: body.name,
            active: true,
          }).save();
        }
      } else if (contactsArray) {
        for (let contact of contactsArray) {
          sentEmail = await SentEmail.create({
            subject: body.subject,
            body: body.body,
            user,
            contact,
            scheduledAt: dateToRun,
            taskName: body.name,
            active: true,
          }).save();
        }
      } else {
        sentEmail = await SentEmail.create({
          subject: body.subject,
          body: body.body,
          user,
          scheduledAt: dateToRun,
          taskName: body.name,
          active: true,
        }).save();
      }

      user.emailsLeft = remainingSends;
      await user.save();
    });
    return okRes(res, `Emails scheduled successfully`);
  };

  static cancelScheduledEmail = async (req, res) => {
    let user = req.user;
    let body = req.body;
    let scheduled;
    let notValid = validate(body, validator.cancelTask());
    if (notValid) return errRes(res, notValid);
    scheduled = await ScheduledMail.findOne({
      user,
      taskName: body.taskName,
      active: true,
    });
    if (!scheduled)
      return errRes(res, `No scheduled email with that name found`);
    let my_job = schedule.scheduledJobs[body.taskName];
    await my_job.cancel();
    scheduled.active = false;
    await scheduled.save();

    return okRes(
      res,
      `Scheduled email ${body.taskName} cancelled successfully`
    );
  };
}
