/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable import/no-import-module-exports */
import express from 'express';
import articleController from '../../controllers/articles/articleController';
import { verifyToken } from '../../middlewares/authCheck.js';

const router = express.Router();

router.get('/get/articles', verifyToken, articleController.getArticles);
router.post('/create', verifyToken, articleController.createArticle);
router.post('/edit/article', verifyToken, articleController.editArticle);
router.get(
  '/get/articles/:id',
  verifyToken,
  articleController.getArticleById,
);
router.post('/get/articlesbytags', verifyToken, articleController.getArticleByTag);
router.delete('/delete/article/:id', verifyToken, articleController.deleteArticle);

module.exports = router;
