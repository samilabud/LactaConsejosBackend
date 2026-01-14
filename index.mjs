import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import articles from "./routes/articles.mjs";
import { initCronJobs } from "./cronJobs.mjs";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3080;

//middelwares
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(express.static("client/src"));
app.use("/images", express.static("images"));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Lacta Consejos API");
});

// Load the /articles routes
app.use("/articles", articles);

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err);
  res
    .status(500)
    .send("Uh oh! An unexpected error occured. Email to: samilabud@gmail.com");
});

// Initialize cron jobs
initCronJobs();

app.listen(PORT, () => {
  console.log(`Lacta Consejos API listening on port ${PORT}`);
});
