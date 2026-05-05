import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

const isValidDateValue = (value) => {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};

// -------------------------
// GET performances
// -------------------------
router.get("/", async (req, res) => {
  const { sport, event, athleteId, teamId } = req.query;

  const filter = {};

  if (sport) filter.sport = sport;
  if (event) filter.event = event;

  if (athleteId) {
    const id = toObjectId(athleteId);
    if (id) filter.athleteId = id;
  }

  if (teamId) {
    const id = toObjectId(teamId);
    if (id) filter.teamId = id;
  }

  const results = await db
    .collection("performances")
    .aggregate([
      { $match: filter },

      // optional athlete join
      {
        $lookup: {
          from: "athletes",
          localField: "athleteId",
          foreignField: "_id",
          as: "athlete",
        },
      },
      { $unwind: { path: "$athlete", preserveNullAndEmptyArrays: true } },

      // optional team join
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "team",
        },
      },
      { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },

      { $sort: { date: -1 } },
      { $limit: 50 },
    ])
    .toArray();

  res.status(200).send(results);
});

// -------------------------
// LATEST
// -------------------------
router.get("/latest", async (_req, res) => {
  const results = await db
    .collection("performances")
    .aggregate([
      {
        $lookup: {
          from: "athletes",
          localField: "athleteId",
          foreignField: "_id",
          as: "athlete",
        },
      },
      { $unwind: { path: "$athlete", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "_id",
          as: "team",
        },
      },
      { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          sport: 1,
          event: 1,
          date: 1,
          stats: 1,
          athlete: 1,
          team: 1,
        },
      },

      { $sort: { date: -1 } },
      { $limit: 5 },
    ])
    .toArray();

  res.status(200).send(results);
});

// -------------------------
// GET ONE
// -------------------------
router.get("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).send({ error: "Invalid id" });

  const result = await db.collection("performances").findOne({ _id });

  if (!result) return res.status(404).send({ error: "Not found" });

  res.status(200).send(result);
});

// -------------------------
// CREATE PERFORMANCE (NEW MODEL)
// -------------------------
router.post("/", async (req, res) => {
  const { sport, event, date, stats, athleteId, teamId, teamEntry, notes } =
    req.body;

  // validation
  if (!sport || !event || !date || !stats) {
    return res.status(400).send({
      error: "sport, event, date, stats required",
    });
  }

  if (!isValidDateValue(date)) {
    return res.status(400).send({ error: "Invalid date" });
  }

  if (typeof stats !== "object" || Array.isArray(stats)) {
    return res.status(400).send({ error: "stats must be object" });
  }

  const doc = {
    sport: sport.trim(),
    event: event.trim(),
    date: new Date(date),
    stats,
    teamEntry: Boolean(teamEntry),
    notes: notes || "",
    createdAt: new Date(),
  };

  if (athleteId) {
    const id = toObjectId(athleteId);
    if (!id) return res.status(400).send({ error: "Invalid athleteId" });
    doc.athleteId = id;
  }

  if (teamId) {
    const id = toObjectId(teamId);
    if (!id) return res.status(400).send({ error: "Invalid teamId" });
    doc.teamId = id;
  }

  const result = await db.collection("performances").insertOne(doc);

  res.status(201).send({
    _id: result.insertedId,
    ...doc,
  });
});

// -------------------------
// UPDATE
// -------------------------
router.patch("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).send({ error: "Invalid id" });

  const { sport, event, date, stats, name, teamEntry, notes } = req.body;

  const $set = {};

  if (sport) $set.sport = sport;
  if (event) $set.event = event;
  if (date) {
    if (!isValidDateValue(date)) {
      return res.status(400).send({ error: "Invalid date" });
    }
    $set.date = new Date(date);
  }

  if (stats) {
    if (typeof stats !== "object") {
      return res.status(400).send({ error: "stats must be object" });
    }
    $set.stats = stats;
  }

  if (athleteId) {
    const id = toObjectId(athleteId);
    if (!id) return res.status(400).send({ error: "Invalid athleteId" });
  }

  if (teamId) {
    const id = toObjectId(teamId);
    if (!id) return res.status(400).send({ error: "Invalid teamId" });
    $set.teamId = id;
  }

  if (typeof teamEntry === "boolean") $set.teamEntry = teamEntry;
  if (notes !== undefined) $set.notes = notes;

  const result = await db
    .collection("performances")
    .updateOne({ _id }, { $set });

  res.status(200).send(result);
});

// -------------------------
// DELETE
// -------------------------
router.delete("/:id", async (req, res) => {
  const _id = toObjectId(req.params.id);
  if (!_id) return res.status(400).send({ error: "Invalid id" });

  const result = await db.collection("performances").deleteOne({ _id });

  res.status(200).send(result);
});

// -------------------------
// GET TOP PERFORMANCES
// -------------------------
router.get("/top", async (req, res) => {
  const { sport, event, limit = 10 } = req.query;

  const results = await db
    .collection("performances")
    .aggregate([
      { $match: { sport, event } },

      {
        $addFields: {
          primaryStat: { $first: { $objectToArray: "$stats" } },
        },
      },

      {
        $sort: { "primaryStat.v": -1 },
      },

      { $limit: parseInt(limit) },
    ])
    .toArray();

  res.json(results);
});

export default router;
