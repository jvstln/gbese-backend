import { Router } from "express";

export const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("Welcome to Gbese platform - Your debt helper");
});
