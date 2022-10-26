/* eslint-disable consistent-return */
/* eslint-disable import/no-import-module-exports */
/* eslint-disable no-console */
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

exports.createArticle = async (req, res) => {
  try {
    const newArticle = await pool.query('INSERT INTO articles(title, article, tag_ids, author_id, photo_url) VALUES($1, $2, $3, $4, $5) RETURNING *', [req.body.title, req.body.article, req.body.tag_ids, req.body.author_id, req.body.photo_url]);

    return res.status(200).json({
      status: 'success',
      data: newArticle.rows[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await pool.query('SELECT * FROM  articles;');

    return res.status(200).json({
      status: 'success',
      data: articles.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const articles = await pool.query('SELECT * FROM  articles WHERE id = $1;', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: articles.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.getArticleByTag = async (req, res) => {
  try {
    const articles = await pool.query('SELECT * FROM  articles WHERE tag_ids @> $1', [req.body.tags]);

    return res.status(200).json({
      status: 'success',
      data: articles.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.editArticle = async (req, res) => {
  try {
    const editedArticle = await pool.query(
      'UPDATE articles SET title = $1, article = $2 WHERE id = $3',
      [req.body.title, req.body.article, req.body.article_id],
    );
    return res.status(200).json({
      status: 'success',
      data: editedArticle.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id =$1', [req.body.user_id]);
    const articleToDelete = await pool.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
    if (articleToDelete?.rows[0].author_id === req.body.user_id || user?.rows[0].jobrole_id === 1) {
      await pool.query('DELETE FROM articles WHERE id = $1', [req.params.id]);
      return res.status(200).json({
        status: 'success',
        data: {},
      });
    }
    return res.status(400).json({
      status: 'error',
      error: 'User not authorised to delete article',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'error',
      error: err.message,
    });
  }
};
