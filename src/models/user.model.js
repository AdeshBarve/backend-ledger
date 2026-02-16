const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');

const userSchema =new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email Is Required"],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
    unique:[true,"Email Already Exist"]
  },

    name:{
        type:String,
        required:[true,"Name Is Required"],
    },
    password:{
        type:password,
        required:true,
        minLength:[6,"Password Must greater Than 6 Characters"],
        select:false
    }
},{timeStamps:true});


userSchema.pre('Save',async()=>{
    if(!isModified(this.password)){
        return next();
    }

    const hash =await bcrypt.hash(this.password,10);
    this.password=hash;

    return next();
})

userSchema.method.comparePassword=async function(password){
return await bcrypt.compare(password,this.password);
}

const userModel =mongoose.model('user',userSchema);

module.exports=userModel;