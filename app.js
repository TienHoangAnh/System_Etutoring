var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


require('dotenv').config();
process.env;
const bcrypt = require('bcrypt'); // Nếu dùng bcrypt

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');
var emailnotisRouter = require('./routes/emails');
var meetingsRouter = require('./routes/meetings');
var messagesRouter = require('./routes/messages');
var scoresRouter = require('./routes/scores');
var subjectsRouter = require('./routes/subjects');


var app = express();


const cors = require("cors");
app.use(cors());  // Cho phép API gọi từ frontend

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get/post data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Dùng biến môi trường nếu có
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Đặt `true` nếu chạy trên HTTPS
}));


// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Passport với Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Lưu user vào session
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Đăng nhập bằng Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Xử lý callback sau khi đăng nhập thành công
app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/" }), 
  (req, res) => {
      res.redirect("/");
  }
);

console.log("✅ GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("✅ CALLBACK_URL:", process.env.CALLBACK_URL);

//connect DB
// var mongoose = require("mongoose");
// var uri = "mongodb+srv://ti3n120903:0zgW1nza35Bd9vsw@etutoringdb.kw8ho.mongodb.net/eTutoringDB";
// mongoose.set('strictQuery', true);
// mongoose.connect(uri)
// .then(() => console.log ("Connect to DB succeed !"))
// .catch((err) => console.log (err));

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://ti3n120903:0zgW1nza35Bd9vsw@etutoringdb.kw8ho.mongodb.net/DBetutoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Kết nối MongoDB thành công!'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use('/emails', emailnotisRouter);
app.use('/meetings', meetingsRouter);
app.use('/messages', messagesRouter);
app.use('/scores', scoresRouter);
app.use('/subjects', subjectsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen (process.env.PORT || 3001);

module.exports = app;
