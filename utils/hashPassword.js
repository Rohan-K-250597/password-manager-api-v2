const bcrypt=require('bcryptjs');

const hashPassword=async(password)=>{
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)
        return hashedPassword;
    }catch(e){
        throw e
    }
}

module.exports={hashPassword};