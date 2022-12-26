const jwt = require('jsonwebtoken');

const jwtVerify = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send("Access Denied");
    }
    try{
        const verify = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verify;
        next();
    }catch(e){
        res.status(400).send('Invalid Token');
    }
}

module.exports = jwtVerify;