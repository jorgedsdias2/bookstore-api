const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://127.0.0.1/api-bookstore", { useNewUrlParser: true })
.then(() => {
    console.log("Database is connected...")
})
.catch((err) => {
    console.error(err)
});