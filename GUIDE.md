# Sports Performance Tracker

## Overview
This project is a NoSQL-based web application for tracking personal bests and sports results for a multi-sport athlete.

The application allows users to log performances across different sports (track, powerlifting, soccer, etc.) with flexible data fields depending on the sport.

This project was inspired by a real-world use case where performance data was previously tracked in a notes app, making it difficult to organize, filter, and analyze over time.

---

## Features
- Add new performance entries
- View past results
- Filter by sport and event
- Track personal bests across different categories
- Flexible schema for different sports

# Week 1 — Adapt Tutorial → Your Data Model

## 1. Reuse Your Existing Tutorial

Your current project likely has:

* Express server setup
* MongoDB connection
* A sample model (e.g., `User`, `Item`, etc.)
* Basic CRUD routes

### What to do:

**Rename + repurpose instead of rewriting**

| Tutorial Piece          | Replace With       |
|-------------------------|--------------------|
| Model (e.g., `User`)    | `Performance`      |
| Routes (e.g., `/users`) | `/performances`    |
| Fields                  | Your sports schema |

---

## 2. Define Your Schema (Mongoose)

Create `/models/Performance.js`

```js
const mongoose = require("mongoose");

const PerformanceSchema = new mongoose.Schema({
  athlete: { type: String, default: "Brother" },
  sport: { type: String, required: true },
  event: { type: String, required: true },
  date: { type: Date, required: true },
  stats: { type: Object, required: true }, // flexible
  tags: [String],
  notes: String
});

module.exports = mongoose.model("Performance", PerformanceSchema);
```

**Important:**
`stats` is intentionally unstructured → this is your NoSQL justification.

---

## 3. Update Routes

Modify your existing routes file (or create `/routes/performances.js`).

### Create Entry

```js
router.post("/", async (req, res) => {
  try {
    const performance = new Performance(req.body);
    const saved = await performance.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Get All Entries

```js
router.get("/", async (req, res) => {
  const data = await Performance.find().sort({ date: -1 });
  res.json(data);
});
```

---

## 4. Add Filtering (important for Week 2 prep)

```js
router.get("/", async (req, res) => {
  const { sport, event } = req.query;

  let filter = {};
  if (sport) filter.sport = sport;
  if (event) filter.event = event;

  const data = await Performance.find(filter).sort({ date: -1 });
  res.json(data);
});
```

---

## 5. Test with Postman / curl

### Example Insert

```json
{
  "sport": "track",
  "event": "100m",
  "date": "2026-03-20",
  "stats": { "time": 11.2 },
  "notes": "Good run"
}
```

### Verify:

* Multiple sports work
* Different `stats` shapes work
* Filtering works

---

## Week 1 Deliverable

* Working API
* MongoDB storing flexible documents
* CRUD + filtering functional

---

# Week 2 — Core Features + Personal Best Logic

## 1. Add “Personal Best” Endpoint

Create:

```js
router.get("/personal-bests", async (req, res) => {
  const data = await Performance.find();

  let bests = {};

  data.forEach(entry => {
    const key = `${entry.sport}-${entry.event}`;

    if (!bests[key]) bests[key] = entry;

    // Example logic (basic)
    if (entry.stats.time && entry.stats.time < bests[key].stats.time) {
      bests[key] = entry;
    }

    if (entry.stats.weight && entry.stats.weight > bests[key].stats.weight) {
      bests[key] = entry;
    }
  });

  res.json(Object.values(bests));
});
```

**Note:** This is intentionally simple. You don’t need a perfect generalized system.

---

## 2. Clean Up Data Assumptions

Pick **2–3 sports max** and define how they behave:

| Sport        | Key Stat | Rule            |
|--------------|----------|-----------------|
| Track        | time     | lower = better  |
| Powerlifting | weight   | higher = better |
| Soccer       | goals    | higher = better |

Hardcoding this is fine.

---

## 3. Optional: Add Basic Validation

Example:

```js
if (!req.body.sport || !req.body.event) {
  return res.status(400).json({ error: "Missing required fields" });
}
```

---

## 4. Prepare for Frontend (Week 3)

Make sure your API is clean:

* `GET /performances`
* `GET /performances?sport=track`
* `POST /performances`
* `GET /performances/personal-bests`
