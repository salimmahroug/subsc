const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentDate: { type: Date, required: true },
    montant: { type: Number, required: true },
    category: { type: String, required: true },
    status:{ type: Boolean, required: false },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
