import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./database/initail.js";

import router from "./routes/restaurant-routes.js";

const app = express();

app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);

//registering routes

const baseUrl = process.env.BASE_URL;
app.use(baseUrl, router);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
