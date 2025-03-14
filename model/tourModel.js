const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toursSchema = new Schema({
  name: { type: String, required: [true, "A tour must have a Name"] },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "A tour must have a price"] },
});

module.exports = mongoose.model("Tour", toursSchema);
