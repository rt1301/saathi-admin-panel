const joi = require('@hapi/joi');
// Register Validation
const registerValidation = (data)=>{
    const schema = joi.object({
        username: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data);
}
// Register Validation
const LoginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    });
    return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.LoginValidation = LoginValidation;