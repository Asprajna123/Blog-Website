const { Router } = require("express");
const User = require("../models/user");
const { handleCreateUser, handleUserSignin } = require("../controllers/user");

const route = Router();

route.get("/signin", (req, res) => {
  return res.render("signin");
});

route.get("/signup", (req, res) => {
  return res.render("signup");
});

route.post("/signup", handleCreateUser);

route.post("/signin", handleUserSignin);

route.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = route;
