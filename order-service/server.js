const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 3001;
const MONGO_URI = "mongodb://host.docker.internal:27017/orders";
const DB_NAME = "ecomerce";

let db;

// Hubungkan ke database
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB:", db.databaseName);
  })
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(cors());

// Route utama
app.get("/", (req, res) => {
  res.send("Order Service is Running");
});

// Endpoint untuk mendapatkan daftar barang
app.get("/orders", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send({ message: "Database not connected" });
    }

    const orders = await db.collection("orders").find().toArray();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
