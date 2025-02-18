import express from 'express';
import { auth } from '../middleware/authMiddleware.mjs';
import {
    getContacts,
    getChatHistory,
    sendMessage,
    markAsRead
} from '../controllers/chatController.mjs';

const router = express.Router();

router.get('/contacts', auth, getContacts);
router.get('/history/:contactId', auth, getChatHistory);
router.post('/send', auth, sendMessage);
router.put('/mark-read/:contactId', auth, markAsRead);

export default router; 