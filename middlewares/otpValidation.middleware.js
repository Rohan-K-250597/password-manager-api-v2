const OTPValidationMiddleware=(req,res,next)=>{
    const otp=req.body.otp?.trim();
    console.log(req.body)
    if(otp.length===6)
        next();
    else
        res.status(400).json({message:'Invalid OTP'});
}
const requestToDeleteUserOTP=(req,res,next)=>{
    const email=req.body.email?.trim();
    const username=req.body.username?.trim();
    if(email,username)
        next();
    else
        res.status(400).json({message:"Please provide username and registered email"})
}

const forgotPasswordRequest=(req,res,next)=>{
    const user=req.body.user?.trim();
    if(user){
        next();
    }
    else{
        res.status(400).json({message:"Please provide username or registered email"})
    }
}
module.exports={
    OTPValidationMiddleware,
    requestToDeleteUserOTP,
    forgotPasswordRequest
}