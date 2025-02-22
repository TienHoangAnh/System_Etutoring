const express = require('express');
const Email = require('../models/emailModel');

const router = express.Router();

// Tạo thông báo email
router.post('/send', async (req, res) => {
    try {
        const newEmail = new Email(req.body);
        await newEmail.save();
        res.status(201).json({ message: "Email đã được gửi!", emailData: newEmail });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách email đã gửi
router.get('/', async (req, res) => {
    try {
        const emails = await Email.find().populate('recipient');
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
