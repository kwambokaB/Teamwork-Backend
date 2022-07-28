/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable import/no-import-module-exports */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'production') {
  // On production server using heroku db connection string
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
  // created a Pool using local env default config on local
  pool = new Pool({ connectionString: process.env.DEV_DATABASE_URL });
}

const secretKey = process.env.JWT_PRIVATE_KEY;

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(400).json({
      status: 'error',
      error: 'User is not Authenticated',
    });
  }
  try {
    const verified = await jwt.verify(token, secretKey);
    req.user = verified;
    // console.log('req.user');
    return next();
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'invalid token',
    });
  }
};

exports.verifyCreateUserToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(400).json({
      status: 'error',
      error: 'User is not Authenticated',
    });
  }
  try {
    const verified = await jwt.verify(token, secretKey);
    // req.user = verified;
    // console.log('verified', verified);

    const userId = verified.id;

    const response = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    // console.log('response', response.rows);
    const user = response.rows[0];
    if (user?.jobrole_id !== 1) {
      return res.status(400).json({
        status: 'error',
        error: 'Only admins can create users',
      });
    }
    return next();
  } catch (err) {
    res.status(400).json({
      status: 'error',
      error: err,
    });
  }
};
