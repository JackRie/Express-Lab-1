// Require the Express module
const express = require("express");
// creates a new router object
const routes = express.Router();

const cartItems = [
  { id: 1, product: "Bananas", price: 2, quantity: 1 },
  { id: 2, product: "Eggs", price: 3, quantity: 1 },
  { id: 3, product: "Milk", price: 2.5, quantity: 1 },
  { id: 4, product: "Bread", price: 3.5, quantity: 1 },
];
let nextId = 5;

// GET /cartItems - responds with an array of Cart Items
routes.get("/cart-items", (req, res) => {
  const maxPrice = parseFloat(req.query.maxPrice);
  const prefix = req.query.prefix;
  const pageSize = req.query.pageSize;
  if (maxPrice) {
    const filteredByMaxPrice = cartItems.filter(
      (cartItem) => cartItem.price <= maxPrice
    );
    res.json(filteredByMaxPrice);
  } else if (prefix) {
    const filteredByPrefix = cartItems.filter((cartItem) => {
      let currentItem = cartItem.product.toLowerCase();
      return currentItem.startsWith(prefix.toLowerCase());
    });
    res.json(filteredByPrefix);
  } else if (pageSize) {
    let results = cartItems.slice(0, parseInt(pageSize));
    res.json(results);
  } else {
    res.json(cartItems);
  }
});

// GET /cartItems/:id - returns Cart Items w/ specified id
routes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cartItem = cartItems.find((cartItem) => cartItem.id === id);
  if (cartItem) {
    res.json(cartItem);
  } else {
    res.status(404);
    res.send(`ID: ${id} Not Found`);
  }
});

// POST /cartItems - adds Cart Item to the end of the array
routes.post("/cart-items", (req, res) => {
  const cartItem = req.body;
  cartItem.id = nextId++;
  cartItems.push(cartItem);

  res.status(201);
  res.json(cartItem);
});

// PUT /cartItems/:id - Updates the cart item in the array with new information
routes.put("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cartItems.findIndex((cartItem) => cartItem.id === id);
  if (index !== -1) {
    cartItems[index] = req.body;
    cartItems[index].id = id;
    res.json(cartItems[index]);
  } else {
    res.status(404);
    res.send(`ID: ${id} Not Found`);
  }
});

// DELETE /cartItems/:id - deletes the cart item from the array
routes.delete("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cartItems.findIndex((cartItem) => cartItem.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  res.status(204);
  res.send();
});

// export routes to use in server.js
module.exports = routes;
