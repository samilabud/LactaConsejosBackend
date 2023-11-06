import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of 50 articles
router.get("/", async (req, res) => {
  const collection = await db.collection("articles");
  const results = await collection
    .find({})
    .sort({ modify_date: -1 })
    .limit(50)
    .toArray();

  res.send(results).status(200);
});
// Fetches the latest articles by category with a limit of 5
router.get("/latest/:category", async (req, res) => {
  const collection = await db.collection("articles");
  const query = {
    category: req.params.category,
  };
  const results = await collection
    .find(query)
    .sort({ date: -1 })
    .limit(5)
    .toArray();
  res.send(results).status(200);
});

// Fetches the latest articles by category with a limit of 5
router.get("/categories", async (req, res) => {
  const collection = await db.collection("articles");
  const results = await collection.distinct("category");
  res.send(results).status(200);
});

// Get a single article
router.get("/:id", async (req, res) => {
  const collection = await db.collection("articles");
  let query = { _id: ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new article to the collection
router.post("/", async (req, res) => {
  const collection = await db.collection("articles");
  const newArticle = req.body;
  newArticle.date = new Date();
  const result = await collection.insertOne(newArticle);
  res.send(result).status(204);
});

// Update an existing article to the collection
router.patch("/:id", async (req, res) => {
  const collection = await db.collection("articles");
  const filter = { _id: ObjectId(req.params.id) };
  req.body.modify_date = new Date();
  const updateQuery = { $set: req.body };
  const result = await collection.updateOne(filter, updateQuery);
  console.log(req);
  res.send(result).status(204);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("articles");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
