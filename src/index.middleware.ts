import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const middlewareRouter = express.Router();

middlewareRouter.use(express.json());
middlewareRouter.use(express.urlencoded());
middlewareRouter.use(cookieParser());
middlewareRouter.use(cors());
