const mongoose=require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database Connected Successfully..");
    })
    .catch(err=>{
        console.log("Database Connection Failed..!",err);
        process.exit(0);
    })
}

module.exports=connectDB;
