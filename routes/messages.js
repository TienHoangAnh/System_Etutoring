const express = require('express');
const Message = require('../models/messageModel');

const router = express.Router();

// Gửi tin nhắn
router.post('/send', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ message: "Tin nhắn đã được gửi!", messageData: newMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tin nhắn giữa hai người dùng
router.get('/:sender/:receiver', async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ sentAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
