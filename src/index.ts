import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
const app = express();
import * as cors from "cors";
const port = process.env.PORT || 3000;
import v1 from "../routes/v1";
import { Subscription } from "./entity/subscription";
import { User } from "./entity/User";

var cron = require("node-cron");
createConnection()
  .then(async (connection) => {
    app.use(express.json());
    app.use(cors());

    app.use("/v1", v1);

    cron.schedule(" 0 0 * * *", async () => {
      let nowInMillis = Date.now();
      let today = Math.floor(nowInMillis / 1000 / 60 / 60 / 24);
      let subscriptions = await Subscription.find({
        where: { expired: false, expiry: today },
      });
      subscriptions.map(async (el) => {
        let user;
        user = await User.findOne({ where: { subscription: el } });
        user.planType = 0;
        user.dailyLimit = 100 * 0.1;
        user.planId = 1;
        el.expired = true;
        await user.save();
        await el.save();
      });
      let users = await User.find({ where: { active: true } });
      users.map(async (user) => {
        user.emailsSentToday = 0;
        await user.save();
      });
    });

    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

