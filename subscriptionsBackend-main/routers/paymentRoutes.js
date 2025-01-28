const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const Subscription = require("../models/user");

// Get all payments for a subscription
router.get("/payment/:subscriptionId", async (req, res) => {
  const { subscriptionId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5; 

  try {
    const payments = await Payment.find({ subscription: subscriptionId })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Payment.countDocuments({
      subscription: subscriptionId,
    });
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      payments,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add a payment to a subscription
router.post("/payment/:subscriptionId", async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const newPayment = new Payment({
      paymentDate: req.body.paymentDate,
      montant: req.body.montant,
      category: req.body.category,
      status: req.body.status,
      subscription: subscriptionId,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a payment from a subscription
router.delete("/payment/:subscriptionId/:paymentId", async (req, res) => {
  const { subscriptionId, paymentId } = req.params;

  try {
    const payment = await Payment.findOneAndDelete({
      _id: paymentId,
      subscription: subscriptionId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
