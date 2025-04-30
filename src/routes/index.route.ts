import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { debtRequestRouter } from "./debtRequest.route";
import { authMiddleware } from "../middlewares/auth.middleware";

export const indexRouter = Router();

indexRouter.get("", (req, res) => {
  res.send("Welcome to Gbese platform - Your debt helper");
});

// For all authenticated routes
indexRouter.use(["/users", "/debt-requests"], authMiddleware.handleSession);

indexRouter.use("/auth", authRouter);

indexRouter.use("/users", userRouter);

indexRouter.use("/debt-requests", debtRequestRouter);
