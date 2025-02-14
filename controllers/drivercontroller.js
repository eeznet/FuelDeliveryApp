import Driver from "../models/driver.js"; // Link to the driver model
import logger from "../config/logger.js";

// Helper function to verify driver role
const verifyDriverRole = (driver) => {
    if (!driver || driver.role !== "driver") {
        throw new Error("Access denied: Invalid driver role");
    }
};

// Log a driver's trip
export const logTrip = async (req, res) => {
    try {
        const { litersCollected, litersDelivered, truckRegistration } = req.body;

        // Validate required fields
        if (!litersCollected || !litersDelivered || !truckRegistration) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: litersCollected, litersDelivered, truckRegistration",
            });
        }

        const driverId = req.user.id; // Assuming `req.user` is set via authentication middleware
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        verifyDriverRole(driver);

        // Log the trip
        const tripLog = {
            litersCollected,
            litersDelivered,
            truckRegistration,
            timestamp: new Date(),
        };

        driver.trips = driver.trips || [];
        driver.trips.push(tripLog);
        await driver.save();

        logger.info(`✅ Trip logged for driver ${driverId}: ${litersCollected} liters collected and ${litersDelivered} delivered.`);
        res.status(201).json({
            success: true,
            message: "Trip logged successfully",
            trip: tripLog,
        });
    } catch (error) {
        logger.error(`❌ Error logging trip: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Error logging trip",
            error: error.message,
        });
    }
};

// Track stock on hand
export const getStockOnHand = async (req, res) => {
    try {
        const driverId = req.user.id;
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        verifyDriverRole(driver);

        const stockOnHand = driver.stockOnHand || 0;
        if (isNaN(stockOnHand)) {
            throw new Error("Invalid stock data");
        }

        logger.info(`✅ Stock on hand for driver ${driverId}: ${stockOnHand}`);
        res.status(200).json({
            success: true,
            message: "Stock on hand retrieved successfully",
            stockOnHand,
        });
    } catch (error) {
        logger.error(`❌ Error retrieving stock on hand: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Error retrieving stock on hand",
            error: error.message,
        });
    }
};

// Update truck location
export const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (latitude == null || longitude == null) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        const driverId = req.user.id;
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        verifyDriverRole(driver);

        driver.location = { latitude, longitude };
        await driver.save();

        logger.info(`✅ Location updated for driver ${driverId}: ${latitude}, ${longitude}`);
        res.status(200).json({
            success: true,
            message: "Location updated successfully",
            location: driver.location,
        });
    } catch (error) {
        logger.error(`❌ Error updating location: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Error updating location",
            error: error.message,
        });
    }
};
