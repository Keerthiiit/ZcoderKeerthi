const Joi = require('joi');

// Middleware to check the structure of credentials before actual database calls

const signupValidation = (req, res, next) => {
    
    const schema = Joi.object({
        handle: Joi.string().alphanum().min(3).max(20).required(),  // Handle name must be unique and shouldn't contain spaces or symbols
        name: Joi.string().pattern(/^[A-Za-z ]+$/).min(3).max(50).required(), // Shouldn't contain symbols or numbers
        email: Joi.string().email().required(),
        password: Joi.string().disallow(' ').pattern(/^\S+$/).min(6).max(20).required() // Max length 20 ans shouldn't contain space
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400)
            .json({ 
                message: "Bad request", 
                error 
        })
    }
    next();
}


module.exports = {
    signupValidation
}