import Client from '../models/client.js';
import logger from '../config/logger.js';

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json({ success: true, clients });
    } catch (error) {
        logger.error(`Error fetching clients: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add more client-related functions like update, delete, etc.
