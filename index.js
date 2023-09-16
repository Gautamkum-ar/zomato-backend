import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./database/initail.js";

import router from "./routes/restaurant-routes.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const baseUrl = process.env.BASE_URL;
//registering routes
app.use(baseUrl, router);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    method: `${req.method} ${req.url} is not allowed`,
  });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    success: false,
    message: err.message,
  });
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
