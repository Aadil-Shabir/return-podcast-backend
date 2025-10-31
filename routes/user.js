const express = require("express");
const {
  createUser,
  updateUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.post("/logout", logoutUser);

module.exports = router;
