const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {registerValidation,LoginValidation} = require('../validation')
router.post('/register',async (req,res)=>{
    const {username,email,password} = req.body;
    const {error,value} = registerValidation(req.body);
    const errMsg = error?error.details[0].message:"";
    if(error){
        return res.status(400).send(errMsg);
    }else{
        // Checking if user already in Database
        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).send("Email Already exists");
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User({
            username,
            email,
            password:hashedPassword
        });
        try{
            const savedUser = await user.save();
            res.send({id:savedUser._id,name:savedUser.username,email:savedUser.email})
        }catch(err){
            res.status(400).send(err);
        }
    }
})


router.post("/login",async (req,res)=>{
    const { email, password } = req.body;
    const { error, value } = LoginValidation(req.body);
    const errMsg = error ? error.details[0].message : "";
    if(error){
        return res.status(400).send(errMsg);
    }else{
        // Checking if user already in Database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User Doesn't exists");
        }
        // Validate Password
        const validPass = await bcrypt.compare(password,user.password);
        if(!validPass){
            return res.status(400).send("Invalid Password");
        }

        // JWT Verification
        const token = jwt.sign({_id:user._id,name:user.username,email:user.email},process.env.TOKEN_SECRET)

        res.header('auth-token',token).send(token);

        // return res.send("Logged In");
    }
})

module.exports = router;