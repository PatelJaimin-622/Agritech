const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors  = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const req = require("express/lib/request");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a USer
exports.registerUser = catchAsyncErrors( async (req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width: 150,
        crop: "scale",
    }) ;
    const {name,email,password} = req.body; 
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        }
    });

    sendToken(user,201,res);

});

//Login User

exports.loginUser = catchAsyncErrors( async (req,res,next)=>{
    const {email,password} = req.body;

    if( !email || !password ){
            return next(new ErrorHandler("Please Enter Email and Password",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid emial or password")); 
    }
    const isPasswordMatch =await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
})


//Logout user

exports.logout = catchAsyncErrors( async (req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
}) 

//Forgot Password
exports.forgotPassword = catchAsyncErrors( async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your Password reset token is below:- \n\n ${resetPasswordUrl} \n\n IF You have not requested this Email then please Ignore It.`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Agritech Password recovery`,
            message,

        });
        res.status(200).json({
            success:true,
            message:`Email send to ${user.email} successfully`
        })
    }
    catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false});
        return next(new ErrorHandler(err.message,500));        
    }

});


//Rest Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()},  
    })

    if(!user){
        return next(new ErrorHandler("Reset Password token is Invalid or has been Expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password dosn't match",400));
    }
    console.log("working");
    console.log(req.body.password);
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
});


//GET User Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})


//Update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch =await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatch){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword!=req.body.confirmPassword)
{
    return next(new ErrorHandler("Password dosent match",400));
}
user.password  =req.body.newPassword;
await user.save();
 sendToken(user,200,res);
})


//Update User Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

        if(req.body.avatar !== ""){
            const user = await User.findById(req.user.id);

            const imageId  = user.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);
            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
                folder:"avatars",
                width: 150,
                crop: "scale",
            }) ;

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              };
        }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

 res.status(200).json({
     success:true,
 });
});

//Get all users(admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    });

});

//Get single users(admin)
exports.getSingleUsers = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    });

});

//Update User Profile --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

 res.status(200).json({
     success:true,
 });
});

//Delete User Profile --Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    
 const user = await User.findById(req.params.id);
// we will remove cloudinary later

if(!user){
    return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`))
}
await user.remove();

 res.status(200).json({
     success:true,
     message:"User Deleted Successfully"
 });
});