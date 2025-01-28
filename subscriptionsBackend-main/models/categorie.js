const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
    label: String,
});

const categorie = mongoose.model("categories", categorieSchema);

module.exports = categorie;
