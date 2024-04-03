const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { addCard } = require("../controllers/cardController");
const auth = require("../middleware/auth");

router.use(auth);

router.post(
  "/add",
  [
    check("name").not().isEmpty(),
    check("expiry").not().isEmpty(),
    check("number").isLuhnNumber(),
  ],
  addCard
);

module.exports = router;
