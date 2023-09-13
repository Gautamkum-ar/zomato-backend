import express from "express";
import {
  addDishToMenu,
  addReviewByUser,
  createRestaurant,
  deleteRestaurant,
  filterRestaurantByRating,
  getAllRestaurant,
  getRestaurantByName,
  getRestaurantsByCuisine,
  getReviewOfRestaurant,
  removeDishByName,
  searchRestaurantByLocation,
  updateRestaurant,
} from "../controllers/restaurant-controller.js";

const router = express.Router();

router.post("/addRestaurant", createRestaurant);
router.get("/all-restaurant", getAllRestaurant);
router.get("/restaurant/:restaurantName", getRestaurantByName);
router.get("/cuisines/:cuisineName", getRestaurantsByCuisine);
router.post("/restaurant/:restaurantId", updateRestaurant);
router.delete("/restaurant/:restaurantId", deleteRestaurant);
router.get("/restaurant/search/:location", searchRestaurantByLocation);
router.get("/restaurant/rating/:minRating", filterRestaurantByRating);
router.post("/restaurant/:restaurantId/menu", addDishToMenu);
router.delete("/restaurant/:restaurantId/menu/:dishName", removeDishByName);
router.post("/restaurant/:restaurantId/review", addReviewByUser);
router.get("/restaurant/:restaurantId/reviews", getReviewOfRestaurant);

export default router;
