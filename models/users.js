const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  cards: [{ type: mongoose.Types.ObjectId, required: true, ref: "Card" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
