const mongoose = require('mongoose');
const item = require('./item').schema;

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [item]
})

const List = mongoose.model("List", listSchema);

module.exports = List;