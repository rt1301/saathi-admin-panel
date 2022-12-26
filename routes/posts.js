const express = require('express');
const router = express.Router();
const jwtVerify = require("../verifyJWT");
router.get("/",jwtVerify,(req,res)=>{
    res.json({
        user:req.user
    });
});
module.exports = router;