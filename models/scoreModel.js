const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    score: { type: Number, min: 0, max: 100, required: true },
    feedback: { type: String, trim: true },
    gradedAt: { type: Date, default: Date.now }
});

const ScoreModel = mongoose.model('score', ScoreSchema,'score');
module.exports = ScoreModel;
