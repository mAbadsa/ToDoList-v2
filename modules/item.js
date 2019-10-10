const mongoose = require("mongoose");

const todosSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// todosSchema.methods.toJSON = () => {
//     const todo = this;
//     const todoObject = todo.toObject();
//     return todoObject;
// }

const Item = mongoose.model('Item', todosSchema);

module.exports = Item;