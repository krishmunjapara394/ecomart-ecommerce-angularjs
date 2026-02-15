import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import appError from "./utils/appError.mjs";
import authRouter from "./routes/authRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import orderRouter from "./routes/orderRouter.mjs";
import productRouter from "./routes/productRouter.mjs";
import featuredProductsRouter from "./routes/featuredProductsRouter.mjs";
import { protect } from "./controllers/authController.mjs";
import cors from "cors";

process.on("uncaughtException", (err) => {
  console.log("uncaught exception ... shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", authRouter);
app.use("/api/users", userRouter);
app.use("/api/profile", userRouter);
app.use("/api/orders", protect, orderRouter);
app.use("/api/products", productRouter);
app.use("/api/featuredproducts", featuredProductsRouter);

// 404 catch-all — must be BEFORE the error handler
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler middleware — catches all next(err) calls
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("ERROR:", err.message);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});

// HANDLE UNHANDLED REJECTED PROMISES
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection ... shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
