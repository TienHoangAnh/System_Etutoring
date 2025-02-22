const express = require('express');
const Blog = require('../models/blogModel');

const router = express.Router();

// Tạo bài viết mới
router.post('/create', async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json({ message: "Bài viết đã được tạo!", blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả bài viết
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
