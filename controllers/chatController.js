import Chat from '../models/chat.js';
import User from '../models/user.js';
import logger from '../config/logger.mjs';

export const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get all staff users (owner, supervisor, finance)
        const contacts = await User.find({
            role: { $in: ['owner', 'supervisor', 'finance'] },
            _id: { $ne: userId }
        }).select('name role avatar isOnline');

        // Get unread message counts for each contact
        const unreadCounts = await Promise.all(
            contacts.map(async (contact) => {
                const count = await Chat.aggregate([
                    {
                        $match: {
                            participants: { 
                                $all: [userId, contact._id] 
                            }
                        }
                    },
                    {
                        $project: {
                            unreadCount: {
                                $size: {
                                    $filter: {
                                        input: '$messages',
                                        cond: { 
                                            $and: [
                                                { $eq: ['$$this.senderId', contact._id] },
                                                { $eq: ['$$this.read', false] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]);
                return { contactId: contact._id, count: count[0]?.unreadCount || 0 };
            })
        );

        const contactsWithCounts = contacts.map(contact => ({
            ...contact.toObject(),
            unreadCount: unreadCounts.find(uc => 
                uc.contactId.toString() === contact._id.toString()
            )?.count || 0
        }));

        res.json(contactsWithCounts);
    } catch (error) {
        logger.error('Error getting contacts:', error);
        res.status(500).json({ success: false, message: 'Failed to get contacts' });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findOne({
            participants: { $all: [userId, contactId] }
        }).populate('messages.senderId', 'name avatar');

        if (!chat) {
            return res.json([]);
        }

        const messages = chat.messages.map(msg => ({
            id: msg._id,
            content: msg.content,
            timestamp: msg.timestamp,
            isSender: msg.senderId.toString() === userId,
            sender: {
                id: msg.senderId._id,
                name: msg.senderId.name,
                avatar: msg.senderId.avatar
            }
        }));

        res.json(messages);
    } catch (error) {
        logger.error('Error getting chat history:', error);
        res.status(500).json({ success: false, message: 'Failed to get chat history' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user.id;

        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, recipientId],
                messages: []
            });
        }

        const newMessage = {
            senderId,
            recipientId,
            content,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        chat.lastMessage = newMessage.timestamp;
        await chat.save();

        // Emit socket event for real-time updates
        req.io.to(recipientId).emit('new_message', {
            ...newMessage,
            isSender: false
        });

        res.json({
            ...newMessage,
            isSender: true
        });
    } catch (error) {
        logger.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user.id;

        await Chat.updateOne(
            { 
                participants: { $all: [userId, contactId] },
                'messages.senderId': contactId,
                'messages.read': false
            },
            { 
                $set: { 'messages.$[msg].read': true }
            },
            {
                arrayFilters: [{ 'msg.senderId': contactId, 'msg.read': false }]
            }
        );

        res.json({ success: true });
    } catch (error) {
        logger.error('Error marking messages as read:', error);
        res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
    }
}; 