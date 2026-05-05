import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
};

// -------------------------
// GET ALL TEAMS
// -------------------------
router.get("/", async (req, res) => {
  const collection = db.collection("teams");
  const results = await collection.find({}).toArray();
  res.status(200).send(results);
});

// -------------------------
// GET ONE TEAM
// -------------------------
router.get("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid team id" });
  }

  const collection = db.collection("teams");
  const result = await collection.findOne({ _id });

  if (!result) {
    return res.status(404).send({ error: "Team not found" });
  }

  return res.status(200).send(result);
});

// -------------------------
// CREATE TEAM (NEW SCHEMA)
// -------------------------
router.post("/", async (req, res) => {
  const { name, sportId } = req.body;

  if (!name || !sportId) {
    return res.status(400).send({
      error: "name and sportId are required",
    });
  }

  const newTeam = {
    name: name.trim(),
    sportId: sportId,
    createdAt: new Date(),
  };

  const collection = db.collection("teams");
  const result = await collection.insertOne(newTeam);

  return res.status(201).send({
    _id: result.insertedId,
    ...newTeam,
  });
});

// -------------------------
// UPDATE TEAM
// -------------------------
router.patch("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid team id" });
  }

  const { name, sportId } = req.body;

  const updates = {};

  if (name) updates.name = name.trim();
  if (sportId) updates.sportId = sportId;

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: "No fields to update" });
  }

  const collection = db.collection("teams");
  const result = await collection.updateOne({ _id }, { $set: updates });

  return res.status(200).send(result);
});

// -------------------------
// UPDATE TEAM ROSTER
// -------------------------
router.patch("/:id/roster", async (req, res) => {
  const _id = toObjectId(req.params.id);
  const { playerIds } = req.body;

  if (!playerIds) {
    return res.status(400).send({ error: "playerIds are required" });
  }

  const collection = db.collection("teams");
  const result = await collection.updateOne({ _id }, { $set: { playerIds } });

  return res.status(200).send(result);
});

// -------------------------
// DELETE TEAM
// -------------------------
router.delete("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);

  if (!_id) {
    return res.status(400).send({ error: "Invalid team id" });
  }

  const collection = db.collection("teams");
  const result = await collection.deleteOne({ _id });

  return res.status(200).send(result);
});

export default router;
