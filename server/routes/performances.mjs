import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

const isValidDateValue = (value) => {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const normalizePayload = (payload = {}) => ({
  athlete: payload.athlete?.trim() || "Brother",
  sport: payload.sport?.trim(),
  event: payload.event?.trim(),
  date: payload.date,
  stats: payload.stats,
  tags: Array.isArray(payload.tags) ? payload.tags : [],
  notes: payload.notes || "",
});

const validateCreatePayload = (payload) => {
  if (!payload.sport || !payload.event || !payload.date || !payload.stats) {
    return "sport, event, date, and stats are required";
  }

  if (!isValidDateValue(payload.date)) {
    return "date must be a valid date value";
  }

  if (typeof payload.stats !== "object" || Array.isArray(payload.stats)) {
    return "stats must be a JSON object";
  }

  return null;
};

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
};

// Get performances with optional sport/event filtering
router.get("/", async (req, res) => {
  const { sport, event } = req.query;
  const filter = {};

  if (sport) {
    filter.sport = sport;
  }

  if (event) {
    filter.event = event;
  }

  const collection = await db.collection("performances");
  const results = await collection
    .find(filter)
    .sort({ date: -1 })
    .limit(50)
    .toArray();

  res.status(200).send(results);
});

// Fetches the latest performances for home page preview
router.get("/latest", async (_req, res) => {
  const collection = await db.collection("performances");
  const results = await collection
    .aggregate([
      {
        $project: {
          athlete: 1,
          sport: 1,
          event: 1,
          date: 1,
          tags: 1,
        },
      },
      { $sort: { date: -1 } },
      { $limit: 3 },
    ])
    .toArray();

  res.status(200).send(results);
});

// Get a single performance
router.get("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid performance id" });
  }

  const collection = await db.collection("performances");
  const result = await collection.findOne({ _id });

  if (!result) {
    return res.status(404).send({ error: "Not found" });
  }

  return res.status(200).send(result);
});

// Add a new performance entry
router.post("/", async (req, res) => {
  const newDocument = normalizePayload(req.body);
  const validationError = validateCreatePayload(newDocument);

  if (validationError) {
    return res.status(400).send({ error: validationError });
  }

  newDocument.date = new Date(newDocument.date);

  const collection = await db.collection("performances");
  const result = await collection.insertOne(newDocument);

  return res.status(201).send(result);
});

// Update an existing performance
router.patch("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid performance id" });
  }

  const updatePayload = normalizePayload(req.body);

  if (updatePayload.date && !isValidDateValue(updatePayload.date)) {
    return res.status(400).send({ error: "date must be a valid date value" });
  }

  if (
    updatePayload.stats &&
    (typeof updatePayload.stats !== "object" ||
      Array.isArray(updatePayload.stats))
  ) {
    return res.status(400).send({ error: "stats must be a JSON object" });
  }

  const updates = {
    $set: {
      athlete: updatePayload.athlete,
      sport: updatePayload.sport,
      event: updatePayload.event,
      date: new Date(updatePayload.date),
      stats: updatePayload.stats,
      tags: updatePayload.tags,
      notes: updatePayload.notes,
    },
  };

  const collection = await db.collection("performances");
  const result = await collection.updateOne({ _id }, updates);

  return res.status(200).send(result);
});

// Delete a performance entry
router.delete("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid performance id" });
  }

  const collection = db.collection("performances");
  const result = await collection.deleteOne({ _id });

  return res.status(200).send(result);
});

export default router;
