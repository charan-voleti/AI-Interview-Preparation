const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//generate JWT token
const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
};

//@desc register a new user
//@route post /api/auth/register
//@access public
const registerUser=async(req,res)=>{
        try{
            const {name,email,password,profileImageUrl}=req.body;

            //check if user already exits
            const userExists= await User.findOne({email});
            if(userExists){
                return res.status(400).json({message:"User already exists"});
            }
            //hash password
            const salt=await bcrypt.genSalt(10);
            const hashedpassword=await bcrypt.hash(password,salt);

            //create new user
            const user=await User.create({
                name,
                email,
                password:hashedpassword,
                profileImageUrl,
            });
            //return user data with JWT
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                profileImageUrl:user.profileImageUrl,
                token:generateToken(user._id),
            });

        }catch(error){
            res.status(500).json({message:'server error',error:error.message})
        }
};

//@desc login user
//@route post /api/auth/login
//@access public
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        //compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"});
        }
        //return user data wit jwt
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message:"server error",error:error.message});
    }
};

//@desc get user profile
// @route get /api/auth/profile
//@access private(require JWT)
const getUserProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not Found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"server error",error:error.message});
    }
};

module.exports={registerUser,loginUser,getUserProfile};