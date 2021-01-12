require("dotenv").config();

let config: any;
export default config = {
  jwtSecret: process.env.JWT_SECRET ,
  sendGrid:process.env.SENDGRID_API_KEY,


  accountSID: process.env.ACCOUNT_SID,
  authToken: process.env.AUTH_TOKEN,
  port: process.env.PORT 
};