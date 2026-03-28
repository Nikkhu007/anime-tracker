const express = require('express');
const Item = require('../models/Item');
const protect = require('../middleware/auth');

const router = express.Router();

// GET /api/items — Get all items for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching items' });
  }
});

// POST /api/items — Add a new item
router.post('/', protect, async (req, res) => {
  try {
    const { title, status, rating } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const item = await Item.create({
      title,
      status: status || 'Plan to Watch',
      rating: rating || 0,
      userId: req.user.id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating item' });
  }
});

// DELETE /api/items/:id — Delete an item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user.id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting item' });
  }
});

module.exports = router;
