import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/scans.js';

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://privacyguard-1.onrender.com"
  ]
}));
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', historyEnabled: mongoose.connection.readyState === 1 }));
app.use('/api/scans', routes);
app.use((_req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err.message));
} else console.warn('MONGODB_URI is not set; history will not persist.');
app.listen(process.env.PORT || 5000, () => console.log(`API listening on ${process.env.PORT || 5000}`));
