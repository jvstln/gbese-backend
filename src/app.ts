import "dotenv/config";
import express from "express";
import { middlewareRouter } from "./middlewares/index.middleware";
import { indexRouter } from "./routes/index.route";
import { connectToDb } from "./utils/db";

const PORT = process.env.PORT || 5000;

connectToDb();

const app = express();

app.use(middlewareRouter);

app.use("/api/v1", indexRouter);

app.all("*splat", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
