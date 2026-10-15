const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true, maxlength: 60 },
  last_name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, trim: true, lowercase: true },
  position: { type: String, required: true, trim: true, maxlength: 80 },
  salary: { type: Number, required: true, min: 0 },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true, trim: true, maxlength: 80 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false });

module.exports = mongoose.model('Employee', employeeSchema);
