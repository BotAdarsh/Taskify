const mongoose = require('mongoose');

const connectToMongo = ()=>{
   
mongoose.connect('mongodb://127.0.0.1:27017/NoteWave', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Successfully connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

}

module.exports = connectToMongo;