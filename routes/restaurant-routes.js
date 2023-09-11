import express from "express";
import { createRestaurant } from "../controllers/restaurant-controller.js";

const router = express.Router();

router.post("/addRestaurant", createRestaurant);

export default router;
