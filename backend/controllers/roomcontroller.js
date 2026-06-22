const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Room = require('../models/roomsmodel')
const User = require('../models/usermodel')

// Get the existing rooms or a room by its id
// You can also add add problems feature, but it would be better only if the authorization is given to admin

// @desc    Get rooms
// @route   Post /getrooms
// @access  Private
const getRooms = asyncHandler(async (req, res) => {
    try {
            const { token } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {
                return res.status(403)
                    .json({ message: errorMsg , success: false});
            }

            const rooms = await Room.find({});
            res.status(200)
                .json({
                    success: true,
                    rooms : rooms
                })

        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})

// @desc    Get room
// @route   Post /rooms/singleroom
// @access  Private
const getRoom = asyncHandler(async (req, res) => {
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

            const room = await Room.findOne({id: id});
            res.status(200)
                .json({
                    success: true,
                    room : room
                })
                
        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})



module.exports = {
  getRooms,
  getRoom
}