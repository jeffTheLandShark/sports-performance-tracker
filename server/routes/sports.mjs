import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

const isValidDateValue = (value) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

// sports cannot be created/updated/deleted via API, so no payload normalization or validation is needed

// get sports
router.get("/", async (req, res) => {
  try {
    const sports = await db.collection("sports").find({}).toArray();
    res.json(sports);
  } catch (err) {
    console.error("Error fetching sports:", err);
    res.status(500).json({ error: "Failed to fetch sports" });
  }
});

export default router;
