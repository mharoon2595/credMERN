const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  name: { type: String, required: true },
  expiry: {
    type: String,
    requried: true,
    validate: {
      validator: function (value) {
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(value)) {
          return false;
        }

        const [month, year] = value.split("/").map(Number);

        if (month < 1 || month > 12) {
          return false;
        }

        const currentYear = new Date().getFullYear() % 100;
        if (
          year < currentYear ||
          (year == currentYear && month < new Date().getMonth + 1)
        ) {
          return false;
        }

        return true;
      },
      message: (props) => `${props.value} is not a valid input`,
    },
  },
  number: { type: String, required: true, minlength: 16 },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Card", cardSchema);
