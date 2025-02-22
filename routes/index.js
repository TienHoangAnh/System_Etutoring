var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const UserModel = require('../models/userModel'); // Import model User
const SubjectModel = require('../models/subjectModel'); // Import model User
const ScoreModel = require('../models/scoreModel'); // Import model User
const MessageModel = require('../models/messageModel'); // Import model User
const MeetingModel = require('../models/meetingModel'); // Import model User
const EmailModel = require('../models/emailModel'); // Import model User
const BlogModel = require('../models/blogModel'); // Import model User


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
  res.render('user/login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Dữ liệu nhận từ frontend:", req.body); 

    if (!email?.trim() || !password?.trim()) {
      return res.send("<script>alert('Vui lòng nhập email và mật khẩu!');history.back();</script>");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.send("<script>alert('Email hoặc mật khẩu không đúng!');history.back();</script>");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("<script>alert('Email hoặc mật khẩu không đúng!');history.back();</script>");
    }

    console.log("🔑 JWT Secret Key:", process.env.JWT_SECRET);
    console.log("🔐 Tạo token...");
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Đảm bảo session đã được khởi tạo trước khi gán giá trị
    if (!req.session) {
      console.error("❌ Session chưa được khởi tạo!");
      return res.status(500).send("Lỗi server: Session chưa được khởi tạo.");
    }

    // Lưu thông tin user vào session
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    };

    let redirectUrl = "/"; // Mặc định
    switch (user.role) {
      case "admin":
        redirectUrl = "/users/homeadmin";
        break;
      case "staff":
        redirectUrl = "/users/homestaff";
        break;
      case "authorized":
        redirectUrl = "/users/homestaff";
        break;
      case "tutor":
        redirectUrl = "/users/hometutor";
        break;
      case "student":
        redirectUrl = "/users/homestudent";
        break;
      default:
        return res.send("<script>alert('Role không hợp lệ!');history.back();</script>");
    }

    console.log(`✅ Đăng nhập thành công! Role: ${user.role}. Chuyển hướng đến: ${redirectUrl}`);
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error("🚨 Lỗi đăng nhập:", error);
    res.status(500).send("Lỗi server");
  }
});

router.get('/create', function(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'staff')) {
    return res.redirect('/login'); // Nếu không phải admin hoặc staff, chuyển về đăng nhập
  }
  res.render('user/create', { user: req.session.user });
});

router.post('/create', async (req, res) => {
  try {
    const { name, email, phone, password, role, gender, address, tutor_id } = req.body;

    console.log("Dữ liệu nhận từ frontend:", req.body); // Debug dữ liệu request

    const createdBy = req.session.user;
    console.log("User đang log:", createdBy); // Debug dữ liệu request

    if (!email?.trim() || !password?.trim()) {
      return res.send("<script>alert('Vui lòng nhập email và mật khẩu hợp lệ!');history.back();</script>");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.send("<script>alert('Email đã tồn tại!');history.back();</script>");
    }

    // Kiểm tra nếu role là student thì bắt buộc phải có tutor_id
    if (role === "student" && (!tutor_id || tutor_id.trim() === "")) {
      return res.send("<script>alert('Student phải chọn gia sư cá nhân!');history.back();</script>");
    }

    // Kiểm tra nếu tutor_id tồn tại và là tutor hợp lệ
    if (role === "student") {
      const tutorExists = await UserModel.findOne({ _id: tutor_id, role: "tutor" });
      if (!tutorExists) {
        return res.send("<script>alert('Gia sư không hợp lệ!');history.back();</script>");
      }
    }

    // Xác định người tạo (staff)
    let createdById = null;
    if (req.session.user && req.session.user.role === "staff") {
      if (role === "student" || role === "tutor") {
        createdById = req.session.user._id;
      }
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // Tạo user
    await UserModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      gender,
      address,
      tutor_id: role === "student" ? staff_id : null, // Chỉ lưu tutor_id nếu là student
      created_by: createdById, // Lưu staff tạo user này
    });

    res.send("<script>alert('Tạo tài khoản thành công!'); window.location.href='/login';</script>");

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send("Lỗi server khi tạo tài khoản!");
  }
});

// router.post('/create', async (req, res) => {
//   try {
//     const { name, email, phone, password, role, gender, address } = req.body;

//     console.log("Dữ liệu nhận từ frontend:", req.body); // Debug xem req.body có dữ liệu không

//     if (!email?.trim() || !password?.trim()) {
//       return res.send("<script>alert('Vui lòng nhập email và mật khẩu hợp lệ!');history.back();</script>");
//     }

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.send("<script>alert('Email đã tồn tại!');history.back();</script>");
//     }

//     // Đảm bảo password không phải undefined/null
//     const cleanPassword = password.trim();
//     if (!cleanPassword) {
//       return res.send("<script>alert('Mật khẩu không hợp lệ!');history.back();</script>");
//     }

//     const hashedPassword = await bcrypt.hash(cleanPassword, 10);

//     await UserModel.create({ name, email, phone, password: hashedPassword, role, gender, address });

//     res.send("<script>alert('Tạo tài khoản thành công!'); window.location.href='/login';</script>");
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).send("Lỗi server");
//   }
// });

router.get('/logout', function(req, res) {
  req.session.destroy((err) => {
      if (err) {
          console.error('Lỗi khi đăng xuất:', err);
          return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
      }
      res.redirect('/login');
  });
});

module.exports = router;
