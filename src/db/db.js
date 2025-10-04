const mongoose = require("mongoose");

 function connectToDb() {
      mongoose.connect("mongodb://127.0.0.1:27017/insta-clonee")
    .then(()=>{
        console.log("connected to mongodb")
    })
}

module.exports = connectToDb