import "dotenv/config";
import express from "express";
import { middlewareRouter } from "./index.middleware";
import { indexRouter } from "./index.route";
import { connectToDb } from "./lib/db";
import transactionRoutes from './routes/transactionRoutes'
import { errorHandler }  from './middlewares/errorMiddleware'
import cors from 'cors'
import helmet  from "helmet";




const PORT = process.env.PORT || 5000;

connectToDb();

const app = express();

app.use(middlewareRouter);


app.use(helmet());
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/v1", indexRouter);
app.use("/api/v1/transactions", transactionRoutes);


app.all("*splat", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

