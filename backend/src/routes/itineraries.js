import { Router } from "express";
import Itinerary from "../models/Itinerary.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function buildDefaultTitle(tripData) {
  const destination =
    tripData?.itinerary?.trip_summary?.destination ||
    tripData?.destination ||
    "My Trip";

  return `${destination} Trip`;
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, tripData, isPublic } = req.body;

    if (!tripData) {
      return res.status(400).json({ error: "tripData is required" });
    }

    const itinerary = await Itinerary.create({
      user: req.user._id,
      title: title?.trim() || buildDefaultTitle(tripData),
      tripData,
      isPublic: Boolean(isPublic),
    });

    return res.status(201).json({ itinerary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save itinerary" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-tripData");

    return res.json({ itineraries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

router.get("/share/:shareId", async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    }).populate("user", "name");

    if (!itinerary) {
      return res.status(404).json({ error: "Shared trip not found" });
    }

    return res.json({ itinerary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch shared trip" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    return res.json({ itinerary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, tripData, isPublic } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    if (title !== undefined) itinerary.title = title.trim();
    if (tripData !== undefined) itinerary.tripData = tripData;
    if (isPublic !== undefined) itinerary.isPublic = Boolean(isPublic);

    await itinerary.save();

    return res.json({ itinerary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update itinerary" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    return res.json({ message: "Itinerary deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

export default router;
