import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import  Jwt  from "jsonwebtoken";
import ENV from '../config.js'
import otpGenerator from 'otp-generator'


export async function verifyUser(req,res,next){
    try {
        const {username} = req.method=="GET" ? req.query : req.body;

        const exist=await userModel.findOne({username})

        if(!exist)res.status(404).send({error:'Cant find user'})
        next();
    } catch (error) {
        return res.status(404).send({error:'Authentication error'})
    }

}



export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check if the username already exists
    const existUsername = await userModel.findOne({ username });
    if (existUsername) {
      return res.status(400).send({ error: "Please use a unique username" });
    }

    // Check if the email already exists
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
      
    }
    
    if (password) {
      // Hash the password
      const hashPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const user = new userModel({
        username,
        password: hashPassword,
        profile: profile || "",
        email,
      });

      // Save the user to the database
      await user.save();

      // Send success response
      return res.status(201).send({ msg: "User registered successfully" });
    } else {
      // Handle the case where the password is not provided
      return res.status(400).send({ error: "Password is required" });
    }
  } catch (error) {
    // Handle other errors

    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}



export async function login(req, res) {
  try {
    const {username,password}=req.body;

    userModel.findOne({username})
    .then(user=>{
        bcrypt.compare(password,user.password)
        .then(passwordcheck=>{
            if(!passwordcheck) return res.status(400).send({error:'password does not match'})

            //jwt token //
            const token= Jwt.sign({
                userid:user._id,
                username:user.username
            }, ENV.JWT_SECRET, {expiresIn : "24h"})
            //.................//
            return res.status(200).send({
                msg:'logged in successfully...',
                username:user.username,
                token
            })
        })
        .catch(error=>res.status(400).send({error:'password does not match'}))
    })
    .catch(error=>res.status(404).send({error:'username not found'}))
  } catch (error) {
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}



export async function getUser(req, res) {
  const {username} = req.params;
  console.log('Fetching user data for username:', username);
    try {
        if(!username) res.status(501).send({error:'invalid username'})

       const user = await userModel.findOne({ username });
            if(!user)res.status(501).send({error:"Couldn't find user "})
            const {password, ...rest} =user.toJSON();
            return res.status(201).send(rest)

    } catch (error)  {
        res.status(404).send({ error: error.message || "Cannot find user data" });
      }

}

export async function updateUser(req, res) {
  try {
    const userId = req.user.userid;

    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update only the provided fields in req.body
    const updateFields = {
      ...(req.body.firstname && { firstname: req.body.firstname }),
      ...(req.body.lastname && { lastname: req.body.lastname }),
      ...(req.body.email && { email: req.body.email }),
      ...(req.body.mobile && { mobile: req.body.mobile }),
      ...(req.body.address && { address: req.body.address }),
      ...(req.body.profile && { profile: req.body.profile }),
    };

    // Using async/await with the promise-based syntax
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      updateFields,
      { new: true } // Return the modified document
    );

    if (updatedUser) {
      return res.status(200).send({ msg: 'Record updated', user: updatedUser });
    } else {
      return res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error during user update:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

  
  
  export async function generateOtp(req, res, next) {
    try {
      const generatedOtp = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
  
      // Store the generated OTP in app.locals
      req.app.locals.OTP = generatedOtp;
  
      // Respond with the generated OTP
      res.status(201).json({ code: generatedOtp });
    } catch (error) {
      console.error('Error generating OTP:', error);
  
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  


export async function verifyOtp(req, res) {
    const { code } = req.query;
    const storedOTP = req.app.locals.OTP;
  
    if (storedOTP && parseInt(storedOTP) === parseInt(code)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(201).send({ msg: "verified successfully" });
    }
  
    return res.status(400).send({ error: "invalid OTP" });
  }
  

export async function createResetSession(req, res) {
  if(  req.app.locals.resetSession ){
    req.app.locals.resetSession = false;
    return res.status(200).send({msg:"access granted"})
  }
  return res.status(404).send({error:"session expired"})
}




export async function resetPassword(req, res) {
    try {

        if(!req.app.locals.resetSession) return res.status(404).send({error:"session expired"})
        const { username, password } = req.body;

        try {
            const user = await userModel.findOne({ username });

            if (!user) {
                return res.status(404).send({ error: 'Username not found' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await userModel.updateOne({ username: user.username }, { password: hashedPassword });

            return res.status(200).send({ msg: 'Record updated' });
        } catch (error) {
            return res.status(500).send({ error: 'Unable to update password' });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}
