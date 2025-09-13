const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();


// POST: Create a new chat Api
router.post('/', authMiddleware.authUSer, chatController.createChat);


module.exports = router;