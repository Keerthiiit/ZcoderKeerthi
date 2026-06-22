const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Solution = require('../models/solutionmodel')
const User = require('../models/usermodel')

// Get solutions to a problem by id or by handle who posted it
// You can also add edit solutions feature

// @desc    Get solutions by handle
// @route   Post /solutions/byhandle
// @access  Private
const getSolutionsByHandle = asyncHandler(async (req, res) => {
    try {
            const { token, handlename } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {
                return res.status(403)
                    .json({ message: errorMsg , success: false});
            }

            const solutions = await Solution.find({ handlename: handlename});
            res.status(200)
                .json({
                    success: true,
                    solutions : solutions
                })
                
        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})

// @desc    Get solutions by pid
// @route   Post /solutions/bypid
// @access  Private
const getSolutionsByPID = asyncHandler(async (req, res) => {
    try {
            const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: "No token provided", success: false });
}

const token = authHeader.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const pid = req.body.pid;

            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {
                return res.status(403)
                    .json({ message: errorMsg , success: false});
            }

            const solutions = await Solution.find({pid: pid});
            res.status(200)
                .json({
                    success: true,
                    solutions : solutions
                })
                
        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

});


// @desc    Post a solution
// @route   POST /solutions/create
// @access  Private
const postSolution = asyncHandler(async (req, res) => {
  const { token, pid, handlename, code, language, approach } = req.body;

  if (!token || !pid || !handlename || !code || !language || !approach) {
    return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user || user.handlename !== handlename) {
      return res.status(403).json({ 
        success: false,
        message: "Authorization failed" 
    });
    }

    const newSolution = new Solution({
      pid: pid,
      handlename: handlename,
      code: code,
      language: language,
      approach: approach,
    });

    await newSolution.save();

    res.status(201).json({ 
        success: true, 
        message: "Solution posted successfully" 
    });

  } catch (err) {
    console.error("Error posting solution:", err);
    res.status(401).json({ 
        success: false, 
        message: "Invalid or expired token" 
    });
  }
});


// @desc    Delete a solution
// @route   DELETE /solutions/delete
// @access  Private
const deleteSolution = asyncHandler(async (req, res) => {

 
    const { token, pid, handlename, language, approach, code } = req.body;

    if (!token || !pid || !handlename || !code || !language || !approach) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields are required" 
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await User.findOne({ email });
        if (!user || user.handlename !== handlename) {
        return res.status(403).json({ 
            success: false, 
            message: "Authorization failed" 
        });
        }

        if(user.handlename !== handlename){
            return res.status(403).json({ 
            success: false, 
            message: "You aren't allowed to delete this solution" 
        });
        }

        const solution = await Solution.findOne({
        pid: pid,
        handlename: handlename,
        code: code,
        language: language,
        approach: approach,
        });

        if (!solution){
        return res.status(404).json({ 
                success: false, 
                message: "Solution not found" 
        });
        }
        await Solution.findByIdAndDelete(solution._id);

        res.status(201).json({ 
            success: true, 
            message: "Solution deleted successfully" 
        });

    } catch (err) {
        console.error("Error deleting solution:", err);
        res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
});


module.exports = {
  getSolutionsByHandle,
  getSolutionsByPID,
  postSolution,
  deleteSolution
}