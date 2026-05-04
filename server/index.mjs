import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import performances from "./routes/performances.mjs";
import athletes from "./routes/athletes.mjs";
import achievements from "./routes/achievements.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the routes
app.use("/performances", performances);
app.use("/athletes", athletes);
app.use("/achievements", achievements);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
