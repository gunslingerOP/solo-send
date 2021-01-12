import config from "../config/index";
import * as jwt from "jsonwebtoken";
import { errRes } from "../helpers/tools";
import { User } from "../src/entity/User";

let Authenticate: any;
export default Authenticate = async (req, res, next): Promise<object> => {
  let payload: any;
  const token = req.headers.token;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
   return errRes(res, `token is not valid`);
  }
  let   user = await User.findOne({
      where: { id: payload.id, verified: true },
    });
    if (!user) return errRes(res, `User does not exist, please complete the registration and verification process.`);
    req.user = user;
  
  return next();
};