const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

const authRequired = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ error: "not authorized" });
  }

  jwt.verify(token, "token_secret", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Failed to authenticate token" });
    }
    req.username = decoded.username;
    req.session.username = decoded.username; // store userId in session
    next();
  });
};

app.use("/customer/auth/*", authRequired);

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
