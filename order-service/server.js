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

    const orders = await db.collection("orders").aggregate([
      {
        $lookup: {
          from: "category", // Nama koleksi kategori
          localField: "category_id", // Field di orders
          foreignField: "category_id", // Field di category
          as: "category_details", // Nama hasil join
        },
      },
      {
        $unwind: "$category_details", // Untuk meratakan array hasil lookup
      },
      {
        $project: {
          barang: 1,
          harga: 1,
          category_name: "$category_details.nama", // Ambil nama kategori
        },
      },
    ]).toArray();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

app.get("/categories", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).send({ message: "Database not connected" });
    }

    const categories = await db.collection("category").find().toArray();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});

// Endpoint untuk menambahkan order baru
app.post("/orders", async (req, res) => {
  try {
    if (!db) {
      console.error("Database not connected");
      return res.status(500).send({ message: "Database not connected" });
    }

    const { barang, harga, category_id } = req.body;

    if (!barang || !harga || !category_id) {
      console.error("Missing fields:", { barang, harga, category_id });
      return res.status(400).send({ message: "Barang, harga, dan category_id wajib diisi." });
    }

    // Validasi apakah category_id ada di koleksi category
    const category = await db.collection("category").findOne({ category_id: category_id });
    if (!category) {
      console.error("Category not found for category_id:", category_id);
      return res.status(400).send({ message: "Category tidak ditemukan." });
    }

    const newOrder = {
      barang,
      harga,
      category_id, // Simpan category_id sebagai string
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);
    console.log("Order created with id:", result.insertedId);
    res.status(201).send({ message: "Order berhasil dibuat.", id: result.insertedId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Internal server error." });
  }
});



// Jalankan server
app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});
