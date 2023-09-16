import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    cuisines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cuisine",
      },
    ],
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menus",
      },
    ],
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("restaurants", RestaurantSchema);
