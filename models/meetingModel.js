const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Gia sư hoặc người tổ chức
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách học viên
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    meetingLink: { type: String, required: true }, // Link Google Meet, Zoom, v.v.
    scheduledAt: { type: Date, required: true }, // Thời gian diễn ra
    duration: { type: Number, required: true }, // Thời lượng (phút)
    createdAt: { type: Date, default: Date.now }
});

const MeetingModel = mongoose.model('meeting', MeetingSchema,'meeting');
module.exports = MeetingModel;
