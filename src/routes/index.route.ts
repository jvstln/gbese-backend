import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";

export const indexRouter = Router();

indexRouter.get("", (req, res) => {
  res.send("Welcome to Gbese platform - Your debt helper");
});

indexRouter.use("/auth", authRouter);

indexRouter.use("/users", userRouter);
