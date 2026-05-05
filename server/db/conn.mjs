import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME || "sports_performance_tracker";

// Configure connection pooling and retry settings for production
const client = new MongoClient(connectionString, {
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});

let db;

try {
  await client.connect();
  db = client.db(dbName);
  console.log("✓ Database connected successfully to:", dbName);
} catch (e) {
  console.error("✗ Failed to connect to database:", e.message);
  process.exit(1);
}

// Graceful shutdown - close connection when server shuts down
process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down gracefully...");
  try {
    await client.close();
    console.log("✓ Database connection closed");
  } catch (e) {
    console.error("✗ Error closing database:", e);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n✓ Shutting down gracefully...");
  try {
    await client.close();
    console.log("✓ Database connection closed");
  } catch (e) {
    console.error("✗ Error closing database:", e);
  }
  process.exit(0);
});

export default db;
