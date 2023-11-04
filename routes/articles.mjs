import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of 50 articles
router.get("/", async (req, res) => {
  const collection = await db.collection("articles");
  const results = await collection.find({}).limit(50).toArray();

  res.send(results).status(200);
});
//  {
//     id: 2,
//     title: 'Consejos para una Lactancia Materna Exitosa',
//     content: '<p><b>Lorem ipsum</b> dolor sit amet, consectetur adipiscing elit. Phasellus ligula ipsum, placerat nec tempor non, mattis vel nibh. Suspendisse in dignissim arcu. In molestie lectus eget quam dignissim ultricies. Vestibulum condimentum sed nulla sit amet tempor. Praesent convallis sed nulla sed sollicitudin. Cras rutrum, erat vel convallis volutpat, mi diam lacinia dui, at tristique arcu ex in ex. Ut tempus ac augue ut lobortis. Proin tellus ex, commodo eu accumsan nec, sagittis eget magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec tincidunt nisi. Praesent vehicula lobortis ornare. Nam a convallis mi. Aliquam malesuada sollicitudin risus, non dapibus neque maximus sit amet. Etiam a bibendum magna, at blandit est. Vestibulum sed turpis non velit tristique sagittis quis et mauris. Cras faucibus magna a ligula lobortis, ac ultricies neque suscipit.</p>',
//     image: '/assets/fotos/articulos/Articulo1.png',
//     category: 'Aprendiendo a Lactar',
//     date: ISODate("2023-11-04T00:00:00.000Z")
//   }
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
  let newArticle = req.body;
  newArticle.date = new Date();
  let result = await collection.insertOne(newArticle);
  res.send(result).status(204);
});

// Update an existing article to the collection
router.patch("/:id", async (req, res) => {
  const collection = await db.collection("articles");
  const filter = { _id: ObjectId(req.params.id) };
  req.body.modify_date = new Date();
  let updateQuery = { $set: req.body };
  let result = await collection.updateOne(filter, updateQuery);
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
