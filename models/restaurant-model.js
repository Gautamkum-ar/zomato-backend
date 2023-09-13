import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cuisines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cuisine",
      },
    ],
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required:true
    },
    rating: {
      type: Number,
      default: 0,
    },
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
