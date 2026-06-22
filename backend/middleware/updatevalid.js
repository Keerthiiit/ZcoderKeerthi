const Joi = require('joi');


// Middleware to check the structure of user data and his credentials before actual database calls


const updateValidation = (req, res, next) => {
    
    const schema = Joi.object({
        username: Joi.string().pattern(/^[A-Za-z ]+$/).min(3).max(50).required(),
        description: Joi.string().max(500) 
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
    updateValidation
}