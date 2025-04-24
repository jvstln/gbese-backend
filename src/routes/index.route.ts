import { Router } from "express";
import { authRouter } from "./auth.route";

export const indexRouter = Router();

indexRouter.get("", (req, res) => {
  res.send("Welcome to Gbese platform - Your debt helper");
});

indexRouter.use("/auth", authRouter);
