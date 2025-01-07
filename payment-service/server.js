const express = require("express");
const app = express();
const PORT = 3003;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Order Service is Running");
});

app.get("/payments", (req, res) => {
  res.json({ payments: [{ id: 1, item: "Product A", amount: 100 }] });
});

// Start Server
app.listen(PORT, () => {
  console.log(`payment Service running on http://localhost:${PORT}`);
});
