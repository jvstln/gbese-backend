import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "../utils/auth";
import { toNodeHandler } from "better-auth/node";

export const middlewareRouter = express.Router();

// better-auth middleware needs to be before express.json() middleware
middlewareRouter.all("/api/v1/better-auth/{*any}", toNodeHandler(auth));

middlewareRouter.use(
  cors({
    origin: [
      /(https?:\/\/)?localhost(:\d+)?/,
      /http(s)?:\/\/127.0.0.1(:\d+)?/,
      /https?:\/\/gbese-app-xsfo.vercel.app/,
    ],
    credentials: true,
    methods: ["PUT", "PATCH", "POST", "GET", "DELETE"],
  })
);
middlewareRouter.use(express.json());
middlewareRouter.use(express.urlencoded({ extended: true }));
middlewareRouter.use(cookieParser());
middlewareRouter.use("/public", express.static("public"));
