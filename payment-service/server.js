const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 3003;
const MONGO_URI = "mongodb://host.docker.internal:27017/payments";
const DB_NAME = "ecomerce";

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB:", DB_NAME);
  })
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Payment Service is running"));

app.post("/payments", async (req, res) => {
  const { id, barang, harga } = req.body;
  try {
    const payment = { id, barang, harga, createdAt: new Date() };
    await db.collection("payments").insertOne(payment);
    res.status(201).send({ message: "Payment added successfully" });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/payments", async (req, res) => {
  try {
    const payments = await db.collection("payments").find().toArray();
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Payment Service running on http://localhost:${PORT}`);
});
