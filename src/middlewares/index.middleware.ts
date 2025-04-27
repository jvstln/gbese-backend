import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const middlewareRouter = express.Router();

middlewareRouter.use(
  cors({
    origin: [/(https?:\/\/)?localhost(:\d+)?/, /http(s)?:\/\/127.0.0.1(:\d+)?/],
    credentials: true,
    methods: ["PUT", "PATCH", "POST", "GET", "DELETE"],
  })
);
middlewareRouter.use(express.json());
middlewareRouter.use(express.urlencoded());
middlewareRouter.use(cookieParser());
