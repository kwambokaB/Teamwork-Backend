/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable import/no-import-module-exports */
import express from 'express';
import userController from '../../controllers/users/userController';
import { verifyCreateUserToken } from '../../middlewares/authCheck.js';

const router = express.Router();

router.post('/login', userController.login);
router.post('/createuser', verifyCreateUserToken, userController.createUser);

module.exports = router;
