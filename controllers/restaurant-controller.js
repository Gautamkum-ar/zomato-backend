import { ErrorMessages, SuccessMessage } from "../const/messages.js";
import cuisineModel from "../models/cuisine-model.js";
import menuModel from "../models/menu-model.js";
import restaurantModel from "../models/restaurant-model.js";
import reviewModel from "../models/review-model.js";

//@desc AddNew restaurant
//route POST  /v1/api/zomato/addRestaurant

export const createRestaurant = async (req, res) => {
  const { name, cuisine, address, city, rating } = req.body;

  try {
    //checking if userInput is empty
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
      data: newRestaurant,
    });
  } catch (error) {
    throw error;
  }
};

//@desc get restaurant by name
//route GET  /v1/api/zomato/restaurant/:restaurantName
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
      .populate({
        path: "cuisines menus review",
        select: "-restaurantId -__v -updatedAt",
      })
      .select("-__v ");

    //checking if restaurant found in database
    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

   return res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (err) {
    throw err;
  }
};

//@desc GET all restaurant
//route POST  /v1/api/zomato/all-restaurant

export const getAllRestaurant = async (req, res) => {
  try {
    const allRestaurant = await restaurantModel
      .find()
      .populate({
        path: "cuisines menus review",
        select: "-restaurantId -__v -updatedAt",
      })
      .select("-__v ");
   return res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      restaurants: allRestaurant,
    });
  } catch (error) {
    throw error;
  }
};

//@desc get restaurant by cuisineName
//route GET  /v1/api/zomato/cuisine/:cuisineName

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

    const findCuisine = await cuisineModel.find({
      cuisineName: cuisineName,
    });
   
    const restaurantIds = findCuisine.map((cuisine) => cuisine.restaurantId);

    const findRestro = await restaurantModel
      .find({
        _id: { $in: restaurantIds }, // Filter by restaurantIds from findCuisine
      })
      .populate({
        path: "cuisines menus review",
        select: "-restaurantId -__v -updatedAt",
      })
      .select("-__v ");

    if (!findRestro.length) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

    return res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findRestro,
    });
  } catch (error) {
    throw error;
  }
};

//@desc update restaurant by restaurantId
//route POST  /v1/api/zomato/restaurant/:restaurantId

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
    ).populate({
      path: "cuisines menus review",
      select: "-restaurantId -__v -updatedAt",
    })
    .select("-__v ");;

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

//@desc delete restaurant by Id
//route DELETE  /v1/api/zomato/restaurant/:restaurantId

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

    await restaurantModel.findByIdAndDelete({ _id: restaurantId });//deleting  restaurant data
    await cuisineModel.deleteMany({ restaurantId: restaurantId });//deleting cuisines of restaurant
    await menuModel.deleteMany({restaurantId:restaurantId})//deleting menus of restuarant
    await reviewModel.deleteMany({restaurantId:restaurantId})//deleting review

   return res.status(200).json({
      message: SuccessMessage.RESRTRO_DELETED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

//@desc get restaurant by location
//route GET  /v1/api/zomato/restaurant/search/:location

export const searchRestaurantByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    if (!location) {
      return res.status(400).json({
        message: ErrorMessages.MISSING_FIELD,
        success: false,
      });
    }
    const findrestaurant = await restaurantModel.findOne({ city: location }) .populate({
      path: "cuisines menus review",
      select: "-restaurantId -__v -updatedAt",
    })
    .select("-__v ");

    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }
      return res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (error) {
    throw error;
  }
};

//@desc filter restaurant by by minRating
//route GET  /v1/api/zomato/restaurant/rating/:rating

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
    }) .populate({
      path: "cuisines menus review",
      select: "-restaurantId -__v -updatedAt",
    })
    .select("-__v ");
    if (!findrestaurant) {
      return res.status(404).json({
        message: ErrorMessages.RESTAURANT_NOT_FOUND,
        success: false,
      });
    }

       return res.status(200).json({
      message: SuccessMessage.DATA_FETCH_SUCCESS,
      success: true,
      data: findrestaurant,
    });
  } catch (error) {
    throw error;
  }
};

//@desc add menus to restaurant
//route POST  /v1/api/zomato/restaurant/:restaurantId/menu

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
//@desc delete dish by name
//route DELETE  /v1/api/zomato/restaurant/:restaurantId/menu/:dishName
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
    const checkDish = await menuModel.findOne(
      { restaurantId: restaurantId },
      { name: dishName }
    );
    if (!checkDish) {
      return res.status(400).json({
        message: ErrorMessages.DISH_NOT_FOUND,
        success: false,
      });
    }

    await menuModel.findOneAndDelete({ _id: checkDish._id });

    // const findDish = await menuModel.find();

    await restaurantModel.findByIdAndUpdate(
      {
        _id: restaurantId,
      },
      { $pull: { menus: checkDish._id } }
    );
    res.status(200).json({
      message: SuccessMessage.MENU_DELETED,
      success: true,
    });
  } catch (error) {
    throw error;
  }
};
//@desc add to review restaurant
//route POST  /v1/api/zomato/restaurant/:restaurantId/review
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
//@desc get restaurant by name
//route GET  /v1/api/zomato/restaurant/:restaurantId/reviews
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
