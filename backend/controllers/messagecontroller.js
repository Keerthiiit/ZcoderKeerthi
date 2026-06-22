const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Message = require('../models/messagesmodel')
const User = require('../models/usermodel')

// Get old messages in a particular room

// @desc    Get room messages
// @route   Post /messages/
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    try {
            const { token, id } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {
                return res.status(403)
                    .json({ message: errorMsg , success: false});
            }

            const messages = await Message.find({id: id});
            console.log(messages);
            res.status(200)
                .json({
                    success: true,
                    messages: messages
                })
                
        } catch (err) {
            res.status(500)
                .json({
                    message: err.message || "Invalid Token",
                    success: false
                })
        }

})



module.exports = {
  getMessages
}