const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Card = require("../models/card");
const User = require("../models/users");
const { default: mongoose } = require("mongoose");

function isValidCreditCardNumber(cardNumber) {
  cardNumber = cardNumber.replace(/\D/g, "");

  const digits = cardNumber.split("").map(Number);

  for (let i = digits.length - 2; i >= 0; i -= 2) {
    let digit = digits[i];
    digit *= 2;
    if (digit > 9) {
      digit -= 9;
    }
    digits[i] = digit;
  }

  const sum = digits.reduce((acc, digit) => acc + digit, 0);

  return sum % 10 === 0;
}

function getCreditCardIssuer(cardNumber) {
  cardNumber = cardNumber.replace(/\D/g, "");

  const visaRegex = /^4/;
  const mastercardRegex = /^5[1-5]/;
  const amexRegex = /^3[47]/;
  const discoverRegex = /^6(?:011|5[0-9]{2})/;
  const dinersClubRegex = /^3(?:0[0-5]|[68][0-9])/;

  if (cardNumber.match(visaRegex)) {
    return "Visa";
  } else if (cardNumber.match(mastercardRegex)) {
    return "Mastercard";
  } else if (cardNumber.match(amexRegex)) {
    return "American Express";
  } else if (cardNumber.match(discoverRegex)) {
    return "Discover";
  } else if (cardNumber.match(dinersClubRegex)) {
    return "Diners Club / Carte Blanche";
  } else {
    return "Unknown";
  }
}

const addCard = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new HttpError("Invalid input, please try again", 422);
    return next(error);
  }

  const { name, expiry, number } = req.body;

  let digits = isValidCreditCardNumber(number);

  if (!digits) {
    const error = new HttpError("Invalid card number, please try again", 422);
    return next(error);
  }

  const newCard = new Card({
    name: name,
    expiry: expiry,
    number: number,
    owner: req.userData.userId,
  });
  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Unable to find user, please login again"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newCard.save({ session: sess });
    user.cards.push(newCard);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Adding place failed, please try again.");
    return next(error);
  }

  res.status(201).json({ card: getCreditCardIssuer(number) + " card added" });
};

exports.addCard = addCard;
