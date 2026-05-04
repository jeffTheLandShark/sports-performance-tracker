import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  return new ObjectId(id);
};

// Get achievements, optionally filtered by athleteId
router.get("/", async (req, res) => {
  const { athleteId } = req.query;
  const filter = {};

  if (athleteId) {
    const parsedAthleteId = toObjectId(athleteId);
    if (parsedAthleteId) {
      filter.athleteId = parsedAthleteId;
    }
  }

  const collection = await db.collection("achievements");
  const results = await collection.find(filter).sort({ date: -1 }).toArray();

  res.status(200).send(results);
});

// Get a single achievement
router.get("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid achievement id" });
  }

  const collection = await db.collection("achievements");
  const result = await collection.findOne({ _id });

  if (!result) {
    return res.status(404).send({ error: "Not found" });
  }

  return res.status(200).send(result);
});

// Create a new achievement (personal record)
router.post("/", async (req, res) => {
  const { athleteId, event, value, unit, date, notes } = req.body;

  if (!athleteId || !event || typeof value === "undefined" || !unit || !date) {
    return res
      .status(400)
      .send({ error: "athleteId, event, value, unit, and date are required" });
  }

  const athleteObjectId = toObjectId(athleteId);
  if (!athleteObjectId) {
    return res.status(400).send({ error: "Invalid athleteId" });
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).send({ error: "date must be a valid date value" });
  }

  const newAchievement = {
    athleteId: athleteObjectId,
    event: event.trim(),
    value,
    unit: unit.trim(),
    date: parsedDate,
    notes: notes ? notes.trim() : "",
    createdAt: new Date(),
  };

  const collection = await db.collection("achievements");
  const result = await collection.insertOne(newAchievement);

  return res.status(201).send(result);
});

// Update an achievement
router.patch("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid achievement id" });
  }

  const { event, value, unit, date, notes } = req.body;

  const updates = {};
  if (event) updates.event = event.trim();
  if (typeof value !== "undefined") updates.value = value;
  if (unit) updates.unit = unit.trim();
  if (date) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).send({ error: "date must be a valid date value" });
    }
    updates.date = parsedDate;
  }
  if (notes !== undefined) updates.notes = notes ? notes.trim() : "";

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: "No fields to update" });
  }

  const collection = await db.collection("achievements");
  const result = await collection.updateOne({ _id }, { $set: updates });

  return res.status(200).send(result);
});

// Delete an achievement
router.delete("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid achievement id" });
  }

  const collection = await db.collection("achievements");
  const result = await collection.deleteOne({ _id });

  return res.status(200).send(result);
});

export default router;
