import express from 'express';
// import { StatusCodes } from 'http-status-codes';

import { PORT } from './config/serverConfig.js';
import connectDB from './Config/dbConfig.js';
import apiRouter from './routes/apiroutes.js';


const app = express();
app.use(express.json());

app.use('/api', apiRouter);
app.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});