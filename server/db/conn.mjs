import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME || "sports_performance_tracker";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db(dbName);

export default db;
