const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: Number, required: true },
    category: { type: String, required: false },
    dateOfBirth: { type: Date, required: true },
    nombre_de_servers: { type: Number, required: true },
    montant: { type: Number, required: true },
    status:{ type: Boolean, required: false },

}, { timestamps: true }); 

const User = mongoose.model("User", userSchema);

module.exports = User;
