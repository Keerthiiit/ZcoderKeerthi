import express from "express";
const router = express.Router();

// TEMP USER PROFILE ROUTE (FIX FOR FRONTEND)
router.get("/me", async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                name: "ZCoder User",
                username: "zcoder123",
                email: "user@zcoder.com",
                bookmarks: [],
                solutions: []
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;