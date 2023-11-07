import { MongoClient } from "mongodb";

const connectionString =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("lactaconsejosdb");

export default db;
