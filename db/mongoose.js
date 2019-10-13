const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://taskapp:test123@cluster0-btkhk.mongodb.net/todolistDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
