import config from "../config/index";
import * as jwt from "jsonwebtoken";
import { User } from "../src/entity/User";
import { errRes } from "../helpers/tools";

const otpVerification = async (req, res, next) => {
  let payload;
  let user;
  let token = req.query.token;
  try {
      payload = jwt.verify(token, config.jwtSecret);
      
  } catch (error) {
      return errRes(res, error)
  }
  if (payload.otp != true) return errRes(res, `This is not a valid OTP token`);
  user = await User.findOne({ where: { id: payload.id } });
  if (!user) errRes(res,`No user found`);
  req.user = user;
  req.payload = payload
  return next();
};

export default otpVerification;
