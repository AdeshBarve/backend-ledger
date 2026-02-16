const express=require('express');
const app=express();
const authRouter=require('./routes/auth.routes');



app.use('/auth/api',authRouter);


module.exports=app;
