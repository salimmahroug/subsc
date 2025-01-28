const mongoose = require("mongoose");

const rentableSchema = new mongoose.Schema({
  montasar: {
    type: Number,
    default :0,
    required: false,
  },
  salim: {
    type: Number,
    default :0,
    required: false,
  },
  value: {
    type: Number,
    default :0,
    required: true,
  },
});

const Rentable = mongoose.model("Rentable", rentableSchema);

module.exports = Rentable;
