import * as bcrypt from "bcrypt";
import config from "../config";
import * as twilio from "twilio";


const accountSid= config.accountSID
const authToken =config.authToken
const client = twilio(accountSid, authToken);
const sgMail = require("@sendgrid/mail");
/**
 * @param res
 * @param err
 * @param statusCode
 */

const errRes = (res, err, statusCode = 400) => {
  let response = { status: false, err };
  res.statusCode = statusCode;
  return res.json(response) 
  
};

const okRes = (res, data, statusCode = 200) => {
  let response = { status: true, data };
  res.statusCode = statusCode;
  return res.json(response);
};
const getOTP = () => Math.floor(1000 + Math.random() * 9000);
const hashMyPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(plainPassword, salt);
  return password;
};

const comparePassword = async (plainPassword, hash) =>
  await bcrypt.compare(plainPassword, hash);

const sendSMS = (body: string, to: string) => {
  client.messages
    .create({ body, from: "+19419993310", to })
    .then((message) => console.log(message)).catch(Error);
};

const paginate = ( p = 1, s = 10)=>{
  let take = s
  let skip = s*(p-1)
  return {take, skip}
}

const emailVerifyOtp = async (email, secretCode, action, link)=>{


  const msg = {
    to: email,
    from: "hasanaqeel38@gmail.com",
    subject: `Your OTP for ${action}!`,
    text: `Your OTP is ${secretCode}`,
    html: `<strong>Your OTP is ${secretCode}</strong>
    <p> Click this link and enter the otp to ${action}: ${link}<p>
    `,
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
}

const sendMail = async (email,body, subject)=>{


  const msg = {

    "personalizations": email,
    from: "hasanaqeel38@gmail.com",
    subject: `${subject}`,
    html: `${body}`,
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
}

export { okRes, errRes,emailVerifyOtp, getOTP, hashMyPassword, comparePassword, sendSMS, paginate, sendMail };