const Driver = require('../models/user'); // Assuming drivers are stored in the User model
const jwt = require('jsonwebtoken');

// Log a driver's trip
exports.logTrip = async (req, res) => {
    const { litersCollected, litersDelivered, truckRegistration } = req.body;

    // Validate required fields
    if (!litersCollected || !litersDelivered || !truckRegistration) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required (litersCollected, litersDelivered, truckRegistration)',
        });
    }

    try {
        const driverId = req.user.id; // Assuming `req.user` is populated by middleware
        const driver = await Driver.findById(driverId);

        // Verify driver existence and role
        if (!driver || driver.role !== 'driver') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Log the trip
        const tripLog = {
            litersCollected,
            litersDelivered,
            truckRegistration,
            timestamp: new Date(),
        };

        // Ensure trips array exists and log the trip
        driver.trips = driver.trips || [];
        driver.trips.push(tripLog);
        await driver.save();

        res.status(201).json({
            success: true,
            message: 'Trip logged successfully',
            trip: tripLog,
        });
    } catch (error) {
        console.error('Error logging trip:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging trip',
            error: error.message,
        });
    }
};

// Track stock on hand
exports.getStockOnHand = async (req, res) => {
    try {
        const driverId = req.user.id; // Assuming `req.user` is populated by middleware
        const driver = await Driver.findById(driverId);

        // Verify driver existence and role
        if (!driver || driver.role !== 'driver') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.status(200).json({
            success: true,
            message: 'Stock on hand retrieved successfully',
            stockOnHand: driver.stockOnHand || 0, // Default to 0 if field is undefined
        });
    } catch (error) {
        console.error('Error retrieving stock on hand:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving stock on hand',
            error: error.message,
        });
    }
};

// Update truck location
exports.updateLocation = async (req, res) => {
    const { latitude, longitude } = req.body;

    // Validate required fields
    if (!latitude || !longitude) {
        return res.status(400).json({
            success: false,
            message: 'Latitude and longitude are required',
        });
    }

    try {
        const driverId = req.user.id; // Assuming `req.user` is populated by middleware
        const driver = await Driver.findById(driverId);

        // Verify driver existence and role
        if (!driver || driver.role !== 'driver') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Update driver location
        driver.location = { latitude, longitude };
        await driver.save();

        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            location: driver.location,
        });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message,
        });
    }
};
