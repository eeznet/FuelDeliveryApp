const Invoice = require('../models/invoice');
const User = require('../models/user');
const TruckLocation = require('../models/trucklocation');
const mongoose = require('mongoose');

// Middleware to check if user is owner
const checkOwnerRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Access denied: You must be an owner to perform this action' });
    }
    next(); // Proceed to the next handler if the user is an owner
};

// Get all invoices for the owner with pagination
exports.getAllInvoices = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
    }

    try {
        const invoices = await Invoice.find()
            .populate('clientId driverId', 'email role')
            .skip((page - 1) * limit)
            .limit(limit);

        const totalInvoices = await Invoice.countDocuments();
        const totalPages = Math.ceil(totalInvoices / limit);

        if (invoices.length === 0) {
            return res.status(404).json({ success: false, message: 'No invoices found' });
        }

        res.status(200).json({
            success: true,
            invoices,
            pagination: { currentPage: page, totalPages, totalInvoices }
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate a report for the owner
exports.generateReport = async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const totalRevenueResult = await Invoice.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

        if (totalInvoices === 0) {
            return res.status(404).json({ success: false, message: 'No invoices found to generate report' });
        }

        res.status(200).json({
            success: true,
            report: { totalInvoices, totalRevenue }
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Monitor all trucks' locations in real-time with pagination
exports.getAllTruckLocations = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid pagination parameters' });
    }

    try {
        const locations = await TruckLocation.find().skip((page - 1) * limit).limit(limit);

        const totalLocations = await TruckLocation.countDocuments();
        const totalPages = Math.ceil(totalLocations / limit);

        if (locations.length === 0) {
            return res.status(404).json({ success: false, message: 'No truck locations found' });
        }

        res.status(200).json({
            success: true,
            locations,
            pagination: { currentPage: page, totalPages, totalLocations }
        });
    } catch (error) {
        console.error('Error fetching truck locations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update client balances manually with timestamp
exports.updateClientBalance = async (req, res) => {
    const { clientId } = req.params;
    const { balance } = req.body;

    if (isNaN(balance) || balance < 0) {
        return res.status(400).json({ success: false, message: 'Balance must be a valid non-negative number' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ success: false, message: 'Invalid client ID' });
        }

        const client = await User.findById(clientId);
        if (!client || client.role !== 'client') {
            return res.status(404).json({ success: false, message: 'Client not found or invalid role' });
        }

        client.balance = balance;
        client.lastBalanceUpdate = new Date();
        await client.save();

        res.status(200).json({ success: true, message: 'Client balance updated successfully', client });
    } catch (error) {
        console.error('Error updating client balance:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// View customer order trends (real data)
exports.getCustomerOrderTrends = async (req, res) => {
    try {
        const trends = await Invoice.aggregate([
            { $group: { _id: { $month: '$date' }, totalOrders: { $sum: 1 } } },
            { $sort: { '_id': 1 } }
        ]);

        if (trends.length === 0) {
            return res.status(404).json({ success: false, message: 'No order trends found' });
        }

        const formattedTrends = trends.map(trend => ({
            month: new Date(0, trend._id - 1).toLocaleString('default', { month: 'long' }),
            orders: trend.totalOrders
        }));

        res.status(200).json({ success: true, formattedTrends });
    } catch (error) {
        console.error('Error fetching customer order trends:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Applying middleware for owner role check to all routes that need it
exports.checkOwnerRole = checkOwnerRole;
