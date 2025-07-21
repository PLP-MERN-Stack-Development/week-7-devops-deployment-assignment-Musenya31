require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');

const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
const uploadRouter = require('./routes/upload');

const rateLimit = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ Logging
app.use(morgan('combined'));

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Disable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ✅ Health check
app.get('/health', (req, res) => res.send('OK'));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// ✅ Root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Rate limit
app.use('/api', rateLimit);

// ✅ API Routes
app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/upload', uploadRouter);

// ✅ Error handler
app.use(errorHandler);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// ✅ Route logger AFTER all routes are registered
console.log('✅ Listing all mounted routes:');
app._router.stack.forEach((layer) => {
  if (layer.route && layer.route.path) {
    const method = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`${method.padEnd(6)} ${layer.route.path}`);
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach((handler) => {
      if (handler.route) {
        const method = Object.keys(handler.route.methods).join(', ').toUpperCase();
        console.log(`${method.padEnd(6)} ${handler.route.path}`);
      }
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
