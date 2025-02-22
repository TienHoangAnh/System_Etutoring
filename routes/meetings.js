const express = require('express');
const Meeting = require('../models/meetingModel');

const router = express.Router();

// Tạo một cuộc họp mới
router.post('/create', async (req, res) => {
    try {
        const newMeeting = new Meeting(req.body);
        await newMeeting.save();
        res.status(201).json({ message: "Cuộc họp đã được lên lịch!", meeting: newMeeting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách cuộc họp
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find().populate('tutor students course');
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
