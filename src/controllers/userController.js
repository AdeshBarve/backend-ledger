
function register(req,res){
try{

    const requestBody=req.body;
    console.log("Req Body : ",requestBody);
    res.send("Welcome to register");

}catch(error){
    console.log("Error Occured : ",error.message);
}
}

module.exports=register;