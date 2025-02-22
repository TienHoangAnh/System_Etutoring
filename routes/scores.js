const express = require('express');
const Score = require('../models/scoreModel');

const router = express.Router();

// Thêm điểm cho học sinh
router.post('/add', async (req, res) => {
    try {
        const newScore = new Score(req.body);
        await newScore.save();
        res.status(201).json({ message: "Điểm đã được cập nhật!", score: newScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy điểm của một học sinh
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const scores = await Score.find({ student: studentId }).populate('course assignment');
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
