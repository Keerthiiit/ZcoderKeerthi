const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usermodel')
const cloudinary = require('../config/cloudinary');


// Controller for user profile - read, edit
// You can also add a delete user featuer but make sure that you have also removed his posted solutions in the solution database using his id


// @desc    Get user data
// @route   Post /user/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
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
    
            res.status(200)
                .json({
                    success: true,
                    user: {
                        handlename: user.handlename,
                        username: user.username,
                        email: user.email,
                        _id: user._id,
                        description: user.description,
                        profilePic: user.profilePic,
                        bookmarks: user.bookmarks,
                        solutions: user.solutions,
                        createdAt: user.createdAt
                    }
                })
        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})

// @desc    Update user profile
// @route   PUT /user/update
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
    });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } 
    catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }

    const email = decoded.email;


    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' });
    }

    const { username, description } = req.body;

    if (username) user.username = username;
    if (description) user.description = description;

    if (req.file) {
        const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const uploadResult = await cloudinary.uploader.upload(base64Data, {
            folder: 'zcoder_users',
        });

        user.profilePic = uploadResult.secure_url;

    }

    await user.save();
    return res.status(200).json({ 
        success: true, 
        user: {
                handlename: user.handlename,
                username: user.username,
                email: user.email,
                _id: user._id,
                description: user.description,
                profilePic: user.profilePic,
                bookmarks: user.bookmarks,
                solutions: user.solutions,
                createdAt: user.createdAt
        } 
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' });
  }
});


// @desc    Get other user data
// @route   Post /user/getother
// @access  Private
const getother = asyncHandler(async (req, res) => {
    try {
            const { token, handle } = req.body;
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {

                return res.status(403)
                    .json({ 
                        message: errorMsg , 
                        success: false}
                    );
            }

            const otheruser=await User.findOne({ handlename: handle });

            if (!otheruser) {
                return res.status(404)
                    .json({ 
                        message: "User doesn't exist" , 
                        success: false}
                    );
            }
    
            res.status(200)
                .json({
                    success: true,
                    user: {
                        handlename: otheruser.handlename,
                        username: otheruser.username,
                        _id: otheruser._id,
                        description: otheruser.description,
                        profilePic: otheruser.profilePic,
                        solutions: otheruser.solutions,
                        createdAt: otheruser.createdAt
                    }
                })
        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

});


// @desc    Set bookmarks
// @route   Post /user/setbookmark
// @access  Private
const setbookmark = asyncHandler(async (req, res) => {
    try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'No token provided' 
                });
            }

            const token = authHeader.split(' ')[1];

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } 
            catch (err) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid or expired token' 
                });
            }

            const email = decoded.email;

            const user = await User.findOne({email});
            if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' });
            }
            
            const { bookmarks } = req.body;
    
            if (!Array.isArray(bookmarks)) {
                return res.status(400).json({
                    success: false,
                    message: 'Bookmarks should be an array',
                });
            }


            user.bookmarks = bookmarks;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Bookmarks updated successfully',
                bookmarks: user.bookmarks,
            });
            
                
        } catch (err) {
            res.status(500)
                .json({
                    message: err.message || "Internal servor error ",
                    success: false
                })
        }

})




module.exports = {
  getMe,
  updateMe,
  getother,
  setbookmark
}