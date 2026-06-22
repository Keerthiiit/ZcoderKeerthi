const express = require('express');
const router = express.Router();
const {
  getSolutionsByHandle,
  getSolutionsByPID,
  postSolution,
  deleteSolution
} = require('../controllers/solutioncontroller');

const verifyToken = require('../middleware/verifytoken'); 

// ✅ Apply token check to all protected routes
router.post('/byhandle', verifyToken, getSolutionsByHandle);
router.post('/bypid', verifyToken, getSolutionsByPID);
router.post('/create', verifyToken, postSolution);
router.delete('/delete', verifyToken, deleteSolution);

module.exports = router;
