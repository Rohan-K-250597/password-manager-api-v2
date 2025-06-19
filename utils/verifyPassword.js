const User=require("../models/user.model");
const validatePassword  = require("./decryptPassword");

const verifyPassword=async(id,password)=>{
    try{
        const userData=await User.findById(id);
        const isPasswordValid=await validatePassword(password,userData.password);
        return isPasswordValid?true:false
    }catch(e){
        throw e
    }
}

module.exports=verifyPassword;