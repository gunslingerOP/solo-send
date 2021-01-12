import * as express from "express";
const router = express.Router()

import apiLimiter from "../middleware/expressLimiter";
import UserController from "../controllers/user.controller";
import otpVerification from "../middleware/verification";
import userAuth from "../middleware/userAuth";
import EmailsController from "../controllers/emails.controller";







router.post("/register",apiLimiter, UserController.register)
router.post("/verify",otpVerification, apiLimiter, UserController.verify)
router.post("/login", UserController.login)
router.post("/login/otp/:userId",otpVerification, otpVerification, UserController.loginOtp)

router.put("/email/change",apiLimiter, userAuth, UserController.changeEmail)
router.put("/email/verify",apiLimiter,otpVerification, userAuth, UserController.verifyEmail)

router.put("/password/change",apiLimiter, userAuth, UserController.changePassword)
router.put("/password/verify",apiLimiter, userAuth,otpVerification, UserController.resetPassword)


router.post("/contact",userAuth, UserController.createContact)
router.delete("/contact/delete",userAuth, UserController.deleteContact)

router.post("/list",userAuth, UserController.createList)
router.put("/list/add/:listId",userAuth, UserController.addToList)
router.delete("/list/delete/:listId",userAuth, UserController.deleteList)

router.post("/send", userAuth, EmailsController.sendEmail)
router.post("/send/scheduled", userAuth, EmailsController.sendScheduledEmail)








export default router