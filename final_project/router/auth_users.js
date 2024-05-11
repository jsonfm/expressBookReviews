const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const user = users.find((item) => item.username === username);
  return !!user;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find((item) => item.username === username);
  if (!user) return false;
  return user.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: "invalid username" });
  }
  if (!password) {
    return res.status(400).json({ error: "invalid password" });
  }
  if (!isValid(username)) {
    return res.status(404).json({ error: "user does not exist" });
  }
  const token = jwt.sign({ username }, "token_secret", {
    expiresIn: "1h",
  });
  return res.status(200).json({ data: { access_token: token } });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const username = req.username;
  console.log({ username });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "invalid message" });
  if (!isbn) return res.status(400).json({ error: "invalid isbn" });
  const book = books[isbn];
  console.log({ book });
  if (!book) return res.status(400).json({ error: "book not found" });
  book["reviews"][username] = { message };
  return res.status(200).json({ data: book });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const username = req.username;

  if (!isbn) return res.status(400).json({ error: "invalid isbn" });
  const book = books[isbn];

  if (!book) return res.status(400).json({ error: "book not found" });
  book["reviews"][username] = {};
  return res.status(200).json({ data: book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
