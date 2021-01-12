import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "../config/index";
import * as express from "express";
const app = express();
import * as cors from "cors";
const port = process.env.PORT || 3000;
import v1 from "../routes/v1";

var cron = require("node-cron");
createConnection()
  .then(async (connection) => {
    app.use(express.json());
    app.use(cors());

    app.use("/v1", v1);

    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
