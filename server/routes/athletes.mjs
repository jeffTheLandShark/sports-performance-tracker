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

// Get all athletes
router.get("/", async (req, res) => {
  const collection = await db.collection("athletes");
  const results = await collection.find({}).toArray();
  res.status(200).send(results);
});

// Get a single athlete with their performances and achievements
router.get("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid athlete id" });
  }

  const collection = await db.collection("athletes");
  const result = await collection.findOne({ _id });

  if (!result) {
    return res.status(404).send({ error: "Not found" });
  }

  return res.status(200).send(result);
});

// Create a new athlete
router.post("/", async (req, res) => {
  const { name, sport, bio, photoUrl } = req.body;

  if (!name || !sport) {
    return res.status(400).send({ error: "name and sport are required" });
  }

  const newAthlete = {
    name: name.trim(),
    sport: sport.trim(),
    bio: bio ? bio.trim() : "",
    photoUrl: photoUrl || "",
    createdAt: new Date(),
  };

  const collection = await db.collection("athletes");
  const result = await collection.insertOne(newAthlete);

  return res.status(201).send(result);
});

// Update an athlete
router.patch("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid athlete id" });
  }

  const { name, sport, bio, photoUrl } = req.body;

  const updates = {};
  if (name) updates.name = name.trim();
  if (sport) updates.sport = sport.trim();
  if (bio !== undefined) updates.bio = bio ? bio.trim() : "";
  if (photoUrl !== undefined) updates.photoUrl = photoUrl || "";

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: "No fields to update" });
  }

  const collection = await db.collection("athletes");
  const result = await collection.updateOne({ _id }, { $set: updates });

  return res.status(200).send(result);
});

// Delete an athlete
router.delete("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid athlete id" });
  }

  const collection = await db.collection("athletes");
  const result = await collection.deleteOne({ _id });

  return res.status(200).send(result);
});

export default router;
