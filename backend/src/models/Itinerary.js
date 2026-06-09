import mongoose from "mongoose";
import crypto from "crypto";

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tripData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    shareId: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(12).toString("hex"),
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
