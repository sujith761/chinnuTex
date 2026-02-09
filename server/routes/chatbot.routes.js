const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// Chatbot endpoints
router.post('/initiate', chatbotController.initiateChatbot);
router.post('/message', chatbotController.processUserMessage);
router.get('/history/:sessionId', chatbotController.getConversationHistory);

module.exports = router;
