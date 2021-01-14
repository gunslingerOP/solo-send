import * as express from "express";
const router = express.Router()

import apiLimiter from "../middleware/expressLimiter";
import UserController from "../controllers/user.controller";
import otpVerification from "../middleware/verification";
import userAuth from "../middleware/userAuth";
import EmailsController from "../controllers/emails.controller";
import DataController from "../controllers/data.controller";







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
router.delete("/scheduled/cancel", userAuth, EmailsController.cancelScheduledEmail)

router.post("/subscribe/:planId", userAuth, UserController.subscribe)
router.delete("/unsubscribe", userAuth, UserController.unsubscribe)
router.post("/buy/:offerId/:amount", userAuth, UserController.buyEmails)

router.post("/template", userAuth, UserController.makeTemplate)
router.delete("/template/:templateId", userAuth, UserController.deleteTemplate)


//get requests

router.get("/contacts", userAuth, DataController.getContacts)
router.get("/lists", userAuth, DataController.getLists)
router.get("/emails", userAuth, DataController.sentEmails)
router.get("/emails", userAuth, DataController.sentEmails)
router.get("/emails", userAuth, DataController.sentEmails)
router.get("/template", userAuth, DataController.getTemplates)


export default router