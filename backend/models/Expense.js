const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Expense name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['food', 'transport', 'housing', 'health', 'entertainment', 'shopping', 'other'],
      default: 'other',
    },
    note: {
      type: String,
      trim: true,
      maxlength: [250, 'Note cannot exceed 250 characters'],
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
