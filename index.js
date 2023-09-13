import express from "express";
import cors from "cors";
import "./database/initail.js";

import router from "./routes/restaurant-routes.js";

const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const baseUrl = process.env.BASE_URL;
//registering routes
app.use(baseUrl, router);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
