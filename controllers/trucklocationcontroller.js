const TruckLocation = require('../models/trucklocation');
const mongoose = require('mongoose');
const io = require('../server');
const User = require('../models/user');

// Utility function for sending standardized error responses
const sendErrorResponse = (res, statusCode, message, errorDetails = null) => {
    console.error(message, errorDetails);
    return res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails ? errorDetails.message : undefined,
    });
};

// Middleware for role-based access control (Admin/Owner)
const checkAdminOrOwnerRole = (req, res, next) => {
    if (!req.user || (req.user.role !== 'owner' && req.user.role !== 'admin')) {
        return res.status(403).json({ success: false, message: 'Access denied: Admin or Owner required' });
    }
    next();
};

// Get Truck Location by Driver ID
const getTruckLocation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendErrorResponse(res, 400, 'Invalid driver ID format');
    }

    try {
        const location = await TruckLocation.findOne({ driverId: id });
        if (!location) {
            return sendErrorResponse(res, 404, 'Truck location not found');
        }
        console.log(`Fetched truck location for driver ID: ${id}`);
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error fetching truck location', error);
    }
};

// Update Truck Location (Driver updates their location)
const updateTruckLocation = async (req, res) => {
    const { driverId, latitude, longitude } = req.body;

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
        return sendErrorResponse(res, 400, 'Invalid driver ID format');
    }

    if (latitude === undefined || longitude === undefined) {
        return sendErrorResponse(res, 400, 'Latitude and longitude are required');
    }

    if (latitude < -90 || latitude > 90) {
        return sendErrorResponse(res, 400, 'Latitude must be between -90 and 90 degrees');
    }
    if (longitude < -180 || longitude > 180) {
        return sendErrorResponse(res, 400, 'Longitude must be between -180 and 180 degrees');
    }

    try {
        const updatedLocation = await TruckLocation.findOneAndUpdate(
            { driverId },
            { latitude, longitude, updatedAt: new Date() },
            { new: true, upsert: true }
        );

        io.emit('truck-location-update', {
            driverId,
            latitude,
            longitude,
            updatedAt: updatedLocation.updatedAt,
        });

        console.log(`Updated truck location for driver ID: ${driverId}`);
        res.status(200).json({
            success: true,
            message: 'Truck location updated successfully',
            data: updatedLocation,
        });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error updating truck location', error);
    }
};

// Get All Truck Locations with Pagination (Admin/Owner)
const getAllTruckLocations = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber <= 0 || isNaN(pageLimit) || pageLimit <= 0) {
        return sendErrorResponse(res, 400, 'Invalid pagination parameters. Ensure both page and limit are positive integers.');
    }

    try {
        const result = await TruckLocation.aggregate([
            { $skip: (pageNumber - 1) * pageLimit },
            { $limit: pageLimit },
            {
                $facet: {
                    truckLocations: [{ $project: { _id: 1, driverId: 1, latitude: 1, longitude: 1, updatedAt: 1 } }],
                    totalCount: [{ $count: "totalLocations" }]
                }
            }
        ]);

        const truckLocations = result[0].truckLocations;
        const totalLocations = result[0].totalCount.length > 0 ? result[0].totalCount[0].totalLocations : 0;
        const totalPages = Math.ceil(totalLocations / pageLimit);

        if (!truckLocations.length) {
            return sendErrorResponse(res, 404, 'No truck locations found');
        }

        console.log('Fetched all truck locations');

        res.status(200).json({
            success: true,
            data: truckLocations,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalLocations,
            },
        });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error fetching truck locations', error);
    }
};

module.exports = {
    getTruckLocation,
    updateTruckLocation,
    getAllTruckLocations: [checkAdminOrOwnerRole, getAllTruckLocations],
};
