import "dotenv/config";
import express from "express";
import { middlewareRouter } from "./middlewares/index.middleware";
import { indexRouter } from "./routes/index.route";
import { connectToDb } from "./utils/db";
import { errorMiddleware } from "./middlewares/error.middleware";
import { setupMiddleware, errorHandler, notFoundHandler } from './index.middleware';

import transactionRoutes from './routes/transaction.routes';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(middlewareRouter);
setupMiddleware(app);



app.use("/api/v1", indexRouter);
app.use('/api/v1/transactions', transactionRoutes);


app.use(notFoundHandler);
app.use(errorHandler);
app.all("*splat", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

const startApp = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startApp();
