
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";

declare global {
  namespace Express {
    export interface Request {
       context: any;
    }
  }
}

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(err, req, res, next) {
  res.status(500).json({ error: err });
});
app.use("/", indexRouter);

export default app;
