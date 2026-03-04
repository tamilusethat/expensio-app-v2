const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// ── GET /api/expenses ─────────────────────────────────────────────────────────
// Query params: category, startDate, endDate, page, limit, sort
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 50, sort = '-date' } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: expenses,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/expenses/summary ─────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());

    const [overall, monthly, weekly, byCategory] = await Promise.all([
      Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
      Expense.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        overall:    { total: overall[0]?.total   || 0, count: overall[0]?.count   || 0 },
        monthly:    { total: monthly[0]?.total   || 0, count: monthly[0]?.count   || 0 },
        weekly:     { total: weekly[0]?.total    || 0, count: weekly[0]?.count    || 0 },
        byCategory: byCategory.map(c => ({ category: c._id, total: c.total, count: c.count })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/expenses/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/expenses ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, amount, category, note, date } = req.body;
    const expense = await Expense.create({ name, amount, category, note, date });
    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/expenses/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense, message: 'Expense updated successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/expenses/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/expenses ──────────────────────────────────────────────────────
router.delete('/', async (req, res) => {
  try {
    await Expense.deleteMany({});
    res.json({ success: true, message: 'All expenses cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
