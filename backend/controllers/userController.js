const asyncHandler = require("express-async-handler")
const User=require("../models/userModel");
const jwt=require("jsonwebtoken");

const generateToken=(id)=> {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1d"
    });
}

//Register a new user

const registerUser=asyncHandler( async (req,res)=> {
    const {name,email,password}=req.body;
    
    //Validation
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    
    if(password.length<6){
        res.status(400);
        throw new Error("Password must be atleast 6 characters long");
    }

    //check if user email already exists
    const userExists=await User.findOne({email:email})
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    
    // create user
    const user = await User.create({
        name,
        email,
        password
    });

    //Generate token
    const token=generateToken(user._id);
    
    //send HTTP only cookie
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        sameSite:"none",
        expires:new Date(new Date().getTime()+24*60*60*1000),//1 day
        secure:true
    });

    if (user) {
        const { _id,name: userName, email, photo, phone, bio } = user;
        res.status(201).json({
            _id,
            name: userName,
            email,
            photo,
            phone,
            bio,
            token,
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//Login a user
const loginUser=asyncHandler(async (req,res)=> {
    const {email,password}=req.body;
    
    //Validation
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    //check if user email already exists
    const user=await User.findOne({email:email})
    if (!user) {
        res.status(400);
        throw new Error("User does not exist");
    }

    //check if password is correct
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
        res.status(400);
        throw new Error("Invalid credentials");
    }

    //Generate token
    const token=generateToken(user._id);
    
    //send HTTP only cookie
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        sameSite:"none",
        expires:new Date(new Date().getTime()+24*60*60*1000),//1 day
        secure:true
    });

    if (user) {
        const { _id,name: userName, email, photo, phone, bio } = user;
        res.status(201).json({
            _id,
            name: userName,
            email,
            photo,
            phone,
            bio,
            token,
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});

module.exports={
    registerUser,
    loginUser
};