import express from "express";
import { accountController } from "../controllers/account.controller";

export const accountRouter = express.Router();

accountRouter.get("/me", accountController.getUserAccount);
