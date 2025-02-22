const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const router = express.Router();

// DefaltGET: /users/...
// ex: users/ 
router.get('/', function (req, res, next) {
  res.render('user/index');
});

router.get('/homeadmin', function(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    const user = { name: name };
    return res.redirect('/login'); // Nếu không phải admin, chuyển về trang đăng nhập
  }
  res.render('user/homeadmin', { user: req.session.user });
});

router.get('/homestaff', function(req, res) {
  if (!req.session.user || req.session.user.role !== 'staff') {
      return res.redirect('/login');
  }
  res.render('user/homestaff', { user: req.session.user });
});

router.get('/hometutor', function(req, res) {
  if (!req.session.user || req.session.user.role !== 'tutor') {
      return res.redirect('/login');
  }
  res.render('user/hometutor', { user: req.session.user });
});

router.get('/homestudent', function(req, res) {
  if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
  }
  res.render('user/homestudent', { user: req.session.user });
});

router.get('/staffmanage', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login'); // Chỉ admin mới được vào
    }

    // Lấy danh sách nhân viên (role = 'staff')
    const staffList = await UserModel.find({ role: 'staff' }).select('name email phone password address');

    // Render trang quản lý nhân viên
    res.render('user/staffmanage', { staffList });

  } catch (error) {
    console.error('Lỗi lấy danh sách nhân viên:', error);
    res.status(500).send('Lỗi server');
  }
});

router.get('/tutormanage', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'staff') {
      return res.redirect('/login'); // Chỉ staff mới được vào
    }

    // Lấy danh sách nhân viên (role = 'tutor')
    const tutorList = await UserModel.find({ role: 'tutor' }).select('name email phone password address');

    // Render trang quản lý nhân viên
    res.render('user/tutormanage', { tutorList });

  } catch (error) {
    console.error('Lỗi lấy danh sách gia sư:', error);
    res.status(500).send('Lỗi server');
  }
});

// API lấy danh sách tutor
router.get("/get-tutors", async (req, res) => {
  try {
      const tutors = await UserModel.find({ role: "tutor" }, "name _id"); // Chỉ lấy tên và ID
      res.json(tutors);
  } catch (error) {
      console.error("Lỗi lấy danh sách tutor:", error);
      res.status(500).json({ message: "Lỗi server" });
  }
});

// API lấy danh sách tutor
router.get("/get-staffs", async (req, res) => {
  try {
      const tutors = await UserModel.find({ role: "staff" }, "name _id"); // Chỉ lấy tên và ID
      res.json(tutors);
  } catch (error) {
      console.error("Lỗi lấy danh sách staff:", error);
      res.status(500).json({ message: "Lỗi server" });
  }
});

// Hiển thị trang chỉnh sửa nhân viên
router.get('/staffmanage/edit/:id', async (req, res) => {
  try {
      const staff = await UserModel.findById(req.params.id).select('name email phone address');
      if (!staff) return res.status(404).send('Nhân viên không tồn tại!');
      res.render('user/edit', { staff });
  } catch (error) {
      console.error('Lỗi khi lấy thông tin nhân viên:', error);
      res.status(500).send('Lỗi server');
  }
});

// Hiển thị trang chỉnh sửa nhân viên
router.get('/tutormanage/edit/:id', async (req, res) => {
  try {
      const staff = await UserModel.findById(req.params.id).select('name email phone address');
      if (!staff) return res.status(404).send('Gia sư không tồn tại!');
      res.render('user/edit', { staff });
  } catch (error) {
      console.error('Lỗi khi lấy thông tin gia sư:', error);
      res.status(500).send('Lỗi server');
  }
});

// Cập nhật thông tin nhân viên
router.post('/staffmanage/edit/:id', async (req, res) => {
  try {
      const { name, email, phone, address } = req.body;

      await UserModel.findByIdAndUpdate(req.params.id, { name, email, phone, address });

      res.redirect('/users/staffmanage');
  } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
      res.status(500).send('Lỗi server');
  }
});

// Cập nhật thông tin gia sư
router.post('/tutormanage/edit/:id', async (req, res) => {
  try {
      const { name, email, phone, address } = req.body;

      await UserModel.findByIdAndUpdate(req.params.id, { name, email, phone, address });

      res.redirect('/users/tutormanage');
  } catch (error) {
      console.error('Lỗi khi cập nhật thông tin gia sư:', error);
      res.status(500).send('Lỗi server');
  }
});

// Xóa nhân viên
router.delete('/staffmanage/delete/:id', async (req, res) => {
  try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ success: true });
  } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      res.json({ success: false });
  }
});

// Xóa gia sư
router.delete('/tutormanage/delete/:id', async (req, res) => {
  try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.json({ success: true });
  } catch (error) {
      console.error('Lỗi khi xóa gia sư:', error);
      res.json({ success: false });
  }
});

module.exports = router;
