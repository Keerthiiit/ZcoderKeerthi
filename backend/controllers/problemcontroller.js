const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Problem = require('../models/problemmodel')
const User = require('../models/usermodel')

// Get the existing problems or a particular problem by its id
// You can also add add problems feature, but it would be better only if the authorization is given to admin

// @desc    Get problems
// @route   Post /problems
// @access  Private

const getFeaturedProblems = asyncHandler(async (req, res) => {
    try {
            const limit = Math.min(Number(req.query.limit) || 3, 6);
            const problems = await Problem.find({})
                .sort({ solved: -1, pid: 1 })
                .limit(limit)
                .select('pid title difficulty topics solved');

            res.status(200)
                .json({
                    success: true,
                    problems : problems
                })

        } catch (err) {
            res.status(500)
                .json({
                    message: err.message || "Unable to load featured problems",
                    success: false
                })
        }

})


const getProblems = asyncHandler(async (req, res) => {
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

            const problems = await Problem.find({});
            res.status(200)
                .json({
                    success: true,
                    problems : problems
                })

        } catch (err) {
            res.status(500)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})

// @desc    Get problem
// @route   Post /problems/singleproblem
// @access  Private
const getProblem = asyncHandler(async (req, res) => {
    try {
            const { token, pid } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
            const user = await User.findOne({ email });
            const errorMsg = `Authorization failed !`;
            if (!user) {
                return res.status(403)
                    .json({ message: errorMsg , success: false});
            }

        const problem = await Problem.findOne({ pid: pid });
            if (!problem) {
                return res.status(404).json({
                    message: "Problem not found",
                    success: false
                });
            }
            res.status(200)
                .json({
                    success: true,
                    problem : problem
                })
                
        } catch (err) {
              res.status(401)
                .json({
                    message: "Invalid Token",
                    success: false
                })
        }

})


module.exports = {
  getProblems,
    getFeaturedProblems,
  getProblem
}