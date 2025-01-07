const express = require("express");
const app = express();
const PORT = 3002;
const { MongoClient } = require("mongodb");
const MONGO_URI = "mongodb://host.docker.internal:27017/users";
const DB_NAME = "ecomerce";
const cors = require("cors");

// Fungsi untuk menghubungkan ke database
let db;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB",db.databaseName);
    console.log(db.collection)
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });
// Middleware
app.use(express.json());
// Tambahkan di bagian atas setelah express middleware
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("user Service is Running");
});

app.get("/users", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send({ message: "Database not connected" });
    }

    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});


app.get("/debug-db", async (req, res) => {
  try {
    // Cek apakah koneksi database sudah ada
    if (!db) {
      return res.status(500).send({ message: "Database not connected" });
    }

    // Tampilkan daftar koleksi di database
    const collections = await db.listCollections().toArray();
    res.json({
      message: "Connected to database",
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    console.error("Error during debug:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});


// Endpoint login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user di database
    const user = await db.collection("users").findOne({ username, password });

    if (user) {
      res.status(200).send({ message: "Login successful!" });
    } else {
      res.status(401).send({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});
// Tambahkan endpoint ini di server.js
app.post("/create-user", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (!db) {
      return res.status(500).send({ message: "Database not connected" });
    }

    // Cek apakah username sudah ada
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "Username already exists" });
    }

    // Buat user baru
    await db.collection("users").insertOne({
      username,
      password,
      createdAt: new Date()
    });

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`user Service running on http://localhost:${PORT}`);
});
