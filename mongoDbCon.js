
const mongoose= require('mongoose');

const mongoConnect =()=>{
    mongoose.connect(" mongodb://127.0.0.1:27017/youtube")
    .then(()=>console.log("Mongo connected"))
    .catch(err=>console.log("mongo error",err))
};

module.exports="mongoConnect";

