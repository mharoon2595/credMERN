const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  addCard,
  getCards,
  fetchStatement,
  payBill,
} = require("../controllers/cardController");

const auth = require("../middleware/auth");

router.use(auth);

router.get("/", getCards);
router.get("/:id/statements/:year/:month", fetchStatement);

router.post(
  "/add",
  [
    check("name").not().isEmpty(),
    check("expiry").not().isEmpty(),
    check("number").isLuhnNumber(),
  ],
  addCard
);

router.post("/:id/pay", payBill);

module.exports = router;
