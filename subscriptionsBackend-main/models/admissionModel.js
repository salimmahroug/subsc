const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
});

const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;
