const express = require('express');
const axios = require('axios');

const app = express();

app.get('/orders', async (req, res) => {
  const response = await axios.get('http://order-service:5001/orders');
  res.json(response.data);
});

app.get('/payments', async (req, res) => {
  const response = await axios.get('http://payment-service:5002/payments');
  res.json(response.data);
});

app.get('/users', async (req, res) => {
  const response = await axios.get('http://user-service:5003/users');
  res.json(response.data);
});

app.listen(8000, () => {
  console.log('API Gateway running on port 8000');
});
