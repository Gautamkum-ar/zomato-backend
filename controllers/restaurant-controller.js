import { ErrorMessages, SuccessMessage } from "../const/messages.js";
import cuisineModel from "../models/cuisine-model.js";
import menuModel from "../models/menu-model.js";
import restaurantModel from "../models/restaurant-model.js";
import reviewModel from "../models/review-model.js";

//AddNew restaurant

export const createRestaurant = async (req, res) => {
  const { name, cuisine, address, city, rating } = req.body;

  try {
    if (!name || !cuisine || !address || !city || !rating) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    const newRestaurant = new restaurantModel({
      name,
      address,
      city,
      rating,
    });

    await newRestaurant.save();

    const newCuisine = new cuisineModel({
      restaurantId: newRestaurant._id,
      cuisineName: cuisine,
    });
    await newCuisine.save();

    await restaurantModel.updateOne(
      { _id: newRestaurant._id },
      { $push: { cuisines: newCuisine._id } }
    );

    res.status(200).json({
      message: SuccessMessage.RESTAURANT_ADDED,
      success: true,
      data: { newRestaurant },
    });
  } catch (error) {
    throw error;
  }
};

//read restuarant by name
export const getRestaurantByName = async (req, res) => {
  const { restaurantName } = req.params;
  try {
    //checking if restaurant name is not provide
    if (restaurantName === "") {
      return res.status(400).json({
        message: ErrorMessages.MISSING_RESTRONAME,
        success: false,
      });
    }

    const findrestaurant = await restaurantModel
      .find({ name: restaurantName })
      .populate("cuisines");

    //checking if restaurant found in database
    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

    res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (err) {
    throw err;
  }
};

// reading all restaurant

export const getAllRestaurant = async (req, res) => {
  try {
    const allRestaurant = await restaurantModel.find().populate("cuisines");
    res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      restaurants: allRestaurant,
    });
  } catch (error) {
    console.log(error);
  }
};

// read restaurant by cuisine type

export const getRestaurantsByCuisine = async (req, res) => {
  const { cuisineName } = req.params;
  try {
    //checking if cuisine name is not provide
    if (cuisineName === "") {
      return res.status(400).json({
        message: ErrorMessages.MISSING_CUISINE_NAME,
        success: false,
      });
    }

    const findCuisine = await cuisineModel.find({ cuisineName: cuisineName });

    const restro = await restaurantModel.find();

    if (!findCuisine.length) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

    res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findCuisine,
    });
  } catch (error) {
    throw error;
  }
};

// update restaurant

export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, cuisine, address, city, rating } = req.body;

  try {
    if (!name || !address || !city || !rating) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    if (!restaurantId) {
      return res.json({
        message: ErrorMessages.MISSING_FIELD,
      });
    }

    const findRestaurantandUpate = await restaurantModel.findByIdAndUpdate(
      { _id: restaurantId },
      { $set: { name: name, address: address, city: city, rating: rating } },
      {
        new: true,
      }
    );

    if (!findRestaurantandUpate) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

    res.status(200).json({
      message: SuccessMessage.RESTRO_UPDATED,
      success: true,
      data: findRestaurantandUpate,
    });
  } catch (error) {
    throw error;
  }
};

// deleting a restaurant

export const deleteRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    if (!restaurantId) {
      return res.status(404).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    const findrestaurant = await restaurantModel.findById({
      _id: restaurantId,
    });
    if (!findrestaurant) {
      return res.status(200).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }
    await restaurantModel.findByIdAndDelete({ _id: restaurantId });
    await cuisineModel.findOneAndDelete({ restaurantId: restaurantId });
    res.status(200).json({
      message: SuccessMessage.RESRTRO_DELETED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

//search restaurant by location

export const searchRestaurantByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    if (!location) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    const findrestaurant = await restaurantModel.findOne({ city: location });

    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }
    res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (error) {
    throw error;
  }
};

// filter restaurant by rating

export const filterRestaurantByRating = async (req, res) => {
  const { minRating } = req.params;
  try {
    if (!minRating) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    const findrestaurant = await restaurantModel.find({
      rating: { $gte: minRating },
    });
    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

    res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (error) {
    throw error;
  }
};

//adding dish to menu

export const addDishToMenu = async (req, res) => {
  const { name, price, discription, isVeg } = req.body;
  const { restaurantId } = req.params;
  try {
    const newMenu = new menuModel({
      restaurantId: restaurantId,
      name: name,
      price: price,
      isVeg: isVeg,
      discription: discription,
    });
    await newMenu.save();
    //updating the restaurant menu
    await restaurantModel.updateOne(
      { _id: restaurantId },
      { $push: { menus: newMenu._id } }
    );

    res.status(200).json({
      message: SuccessMessage.MENU_ADDED,
      success: true,
      data: newMenu,
    });
  } catch (error) {
    throw error;
  }
};

export const removeDishByName = async (req, res) => {
  const { restaurantId, dishName } = req.params;

  try {
    //checking for input
    if (!restaurantId || !dishName) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    //checking if dish present in menus list
    const checkDish = await menuModel.findOne({ name: dishName });
    if (!checkDish) {
      return res.status(400).json({
        message: ErrorMessages.DISH_NOT_FOUND,
        success: false,
      });
    }
    // // checking in restaurant if dish is present or not
    // const checkInRestro = await restaurantModel.findById({ _id: restaurantId });

    // if (!filtering.length) {
    //   return res.status(400).json({
    //     message: ErrorMessages.DISH_NOT_IN_RESTRO,
    //     success: false,
    //   });
    // }
    await menuModel.findOneAndDelete({ name: dishName });
    const findDish = await menuModel.find();

    await restaurantModel.findByIdAndUpdate(
      {
        _id: restaurantId,
      },
      { menus: findDish }
    );
    res.status(200).json({
      message: SuccessMessage.MENU_DELETED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

export const addReviewByUser = async (req, res) => {
  const { restaurantId } = req.params;
  const { userId, rating, reviewText } = req.body;
  try {
    const newReview = new reviewModel({
      rating: rating,
      userId: userId,
      reviewText: reviewText,
      restaurantId: restaurantId,
    });
    await newReview.save();
    await restaurantModel.updateOne(
      { _id: restaurantId },
      { $push: { review: newReview._id } }
    );

    return res.status(200).json({
      message: SuccessMessage.REVIEW_ADDED,
      success: true,
      data: newReview,
    });
  } catch (error) {
    throw error;
  }
};

export const getReviewOfRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    if (!restaurantId) {
      return res.status(400).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: true,
      });
    }
    const findReviews = await reviewModel.find({ restaurantId: restaurantId });
    if (!findReviews.length) {
      return res.status(404).json({
        message: ErrorMessages.REVIEW_NOT_FOUND,
        success: false,
      });
    }
    return res.status(200).json({
      message: SuccessMessage.REVIEW_FOUND,
      success: true,
      data: findReviews,
    });
  } catch (error) {
    throw error;
  }
};
