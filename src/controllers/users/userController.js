/* eslint-disable consistent-return */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-console */
import bcryptjs from 'bcryptjs';
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

exports.createUser = async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const findUser = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
    if (findUser.rows.length) {
      return res.status(400).json({
        status: 'error',
        error: 'user with email already exists. Please Log in',
      });
    }

    const resp = await pool.query('INSERT INTO users(firstname, lastname, email, password, gender_id, jobrole_id, department_id, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [req.body.firstname, req.body.lastname, req.body.email, hashedPassword, req.body.gender_id, req.body.jobrole_id, req.body.department_id, req.body.address]);

    console.log(resp.rows[0]);

    //  create token

    const token = jwt.sign(
      { id: resp.rows[0].id },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '2H',
      },
    );
    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: resp.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
    // console.log(user.rows[0].password, req.body.password);
    if (user.rows.length) {
      const validPass = await bcryptjs.compare(req.body.password, user.rows[0].password);
      // console.log(validPass);
      if (!validPass) {
        return res.status(400).json({
          status: 'error',
          error: 'invalid Password',
        });
      }
      //  create token
      const token = jwt.sign(
        { id: user.rows[0].id },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: '2H',
        },
      );
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: user.rows[0],
        },
      });
    }
    return res.status(400).json({
      status: 'error',
      error: 'invalid email',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};
