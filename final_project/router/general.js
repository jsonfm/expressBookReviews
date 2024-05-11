const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password, password_confirmation } = req.body;
  if (!username) {
    return res.status(400).json({ error: "invalid username" });
  }
  if (!password) {
    return res.status(400).json({ error: "invalid password" });
  }
  if (password !== password_confirmation) {
    return res.status(400).json({ error: "passwords does not match" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "success" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return res.status(200).json({ data: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const book = books[isbn];
  return res.status(200).json({ data: book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;
  // const mapped = Object.entries(books)
  const result = Object.values(books).filter((item) =>
    item.author?.toLocaleLowerCase().includes(author?.toLocaleLowerCase())
  );
  return res.status(200).json({ data: result });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req.params;
  const result = Object.values(books).filter((item) =>
    item.title?.toLocaleLowerCase().includes(title?.toLocaleLowerCase())
  );
  return res.status(200).json({ data: result });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).jason({ error: "book does not exist" });
  const reviews = book?.["reviews"];
  // return res.status(200).json({ data: book });
  return res.status(200).json({ data: reviews });
});

module.exports.general = public_users;
