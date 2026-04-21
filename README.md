# Sports Performance Tracker

## Overview
This project is a NoSQL-based web application for tracking personal bests and sports results for a multi-sport athlete.

## Features
- Add new performance entries
- View past results
- Filter by sport and event
- Track personal bests across different categories

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)

## Data Model

Each performance is stored as a document:

```json
{
  "sport": "track",
  "event": "100m",
  "date": "2026-03-20",
  "stats": { "time": 11.2 },
  "notes": "Good run"
}
```

The `stats` field is flexible and varies depending on the sport.
