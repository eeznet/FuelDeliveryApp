const Invoice = require('../models/invoice');
const User = require('../models/user');
const TruckLocation = require('../models/trucklocation');
const mongoose = require('mongoose');

// Get all invoices for the owner with pagination
exports.getAllInvoices = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const invoices = await Invoice.find()
            .populate('clientId driverId', 'email role')
            .skip((page - 1) * limit)
            .limit(limit);

        if (!invoices.length) {
            return res.status(404).json({ message: 'No invoices found' });
        }

        const totalInvoices = await Invoice.countDocuments();
        const totalPages = Math.ceil(totalInvoices / limit);

        res.status(200).json({
            invoices,
            pagination: {
                currentPage: page,
                totalPages,
                totalInvoices
            }
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
};

// Generate a report for the owner
exports.generateReport = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const totalInvoices = await Invoice.countDocuments();
        const totalRevenueResult = await Invoice.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

        const report = {
            totalInvoices,
            totalRevenue,
        };

        res.status(200).json(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};

// Monitor all trucks' locations in real-time with pagination
exports.getAllTruckLocations = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const locations = await TruckLocation.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (!locations.length) {
            return res.status(404).json({ message: 'No truck locations found' });
        }

        const totalLocations = await TruckLocation.countDocuments();
        const totalPages = Math.ceil(totalLocations / limit);

        res.status(200).json({
            locations,
            pagination: {
                currentPage: page,
                totalPages,
                totalLocations
            }
        });
    } catch (error) {
        console.error('Error fetching truck locations:', error);
        res.status(500).json({ message: 'Error fetching truck locations', error: error.message });
    }
};

// Update client balances manually with timestamp
exports.updateClientBalance = async (req, res) => {
    const { clientId } = req.params;
    const { balance } = req.body;

    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const client = await User.findById(clientId);

        if (!client || client.role !== 'client') {
            return res.status(404).json({ message: 'Client not found or invalid role' });
        }

        client.balance = balance;
        client.lastBalanceUpdate = new Date(); // Timestamp for when the balance was updated
        await client.save();

        res.status(200).json({ message: 'Client balance updated successfully', client });
    } catch (error) {
        console.error('Error updating client balance:', error);
        res.status(500).json({ message: 'Error updating client balance', error: error.message });
    }
};

// View customer order trends (real data)
exports.getCustomerOrderTrends = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const trends = await Invoice.aggregate([
            { $group: { _id: { $month: '$date' }, totalOrders: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const formattedTrends = trends.map(trend => ({
            month: new Date(0, trend._id - 1).toLocaleString('default', { month: 'long' }),
            orders: trend.totalOrders
        }));

        res.status(200).json(formattedTrends);
    } catch (error) {
        console.error('Error fetching customer order trends:', error);
        res.status(500).json({ message: 'Error fetching customer order trends', error: error.message });
    }
};
