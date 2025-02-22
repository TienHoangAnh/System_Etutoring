const express = require('express');
const Subject = require('../models/subjectModel');

const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Subject Home' });
});

// 📌 Thêm môn học mới
router.post('/create', async (req, res) => {
    try {
        const { name, description, tutor } = req.body;
        const newSubject = new Subject({ name, description, tutor });
        await newSubject.save();
        res.status(201).json({ message: "Môn học đã được tạo!", subject: newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Lấy danh sách tất cả môn học
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().populate('tutor students');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Đăng ký học môn học
router.post('/:subjectId/enroll', async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { studentId } = req.body;

        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ error: "Môn học không tồn tại" });

        if (!subject.students.includes(studentId)) {
            subject.students.push(studentId);
            await subject.save();
        }

        res.json({ message: "Đăng ký thành công!", subject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Lấy thông tin một môn học cụ thể
router.get('/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId).populate('tutor students');
        if (!subject) return res.status(404).json({ error: "Môn học không tồn tại" });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
