const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const path = require('path');

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the file path (relative to server root)
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router; 