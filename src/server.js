/* eslint-disable no-console */
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import initializeDb from './database/dbinit';
import userRoute from './routes/users/userRoute';
import articleRoute from './routes/articles/articleRoute';

const app = express();
app.use(cors());

// Initialize db, create tables if not present
// do this if current environment is not test
if (process.env.NODE_ENV !== 'test') {
  initializeDb();
}
// setup express body-perser for json data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use('/', (req, res) => {
  res.status(200).send('Welcome to this awesome api!!');
});
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/articles', articleRoute);

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

export default app;
