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
        type:String,
        required:true,
        minLength:[6,"Password Must greater Than 6 Characters"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false 
    }
},{timeStamps:true});



userSchema.pre('save',async function(){
    console.log("This ",this);
    
    console.log("Password :",this.password," Is modified :",this.isModified(this.password));
    if(this.isModified(this.password)){
        return 
    }
    
    const hash =await bcrypt.hash(this.password,10);
    console.log("Hashed Pass : ",hash);
    this.password=hash;

    return 
})

userSchema.methods.comparePassword=async function(password){
return await bcrypt.compare(password,this.password);
}

const userModel =mongoose.model('user',userSchema);

module.exports=userModel;