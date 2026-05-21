const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../dist/index.html')));
} else {
  app.get('/', (req, res) => res.send('LegalAdvisor API (Development)'));
}

app.use(errorHandler);

module.exports = app;
