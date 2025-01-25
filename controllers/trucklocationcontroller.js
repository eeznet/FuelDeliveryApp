const TruckLocation = require('../models/trucklocation');
const io = require('../server'); // Import `io` instance for real-time updates

// Utility function for sending standardized error responses
const sendErrorResponse = (res, statusCode, message, errorDetails = null) => {
    console.error(message, errorDetails);
    return res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails ? errorDetails.message : undefined,
    });
};

// Get Truck Location by Driver ID
exports.getTruckLocation = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return sendErrorResponse(res, 400, 'Driver ID is required');
    }

    try {
        const location = await TruckLocation.findOne({ driverId: id });
        if (!location) {
            return sendErrorResponse(res, 404, 'Truck location not found');
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error fetching truck location', error);
    }
};

// Update Truck Location (Driver updates their location)
exports.updateTruckLocation = async (req, res) => {
    const { driverId, latitude, longitude } = req.body;

    // Validation
    if (!driverId || latitude === undefined || longitude === undefined) {
        return sendErrorResponse(res, 400, 'Driver ID, latitude, and longitude are required');
    }

    // Validate latitude and longitude ranges
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
            { new: true, upsert: true } // Create if not found
        );

        // Broadcast real-time location update
        io.emit('truck-location-update', {
            driverId,
            latitude,
            longitude,
            updatedAt: updatedLocation.updatedAt,
        });

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
exports.getAllTruckLocations = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Validate pagination
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber <= 0 || isNaN(pageLimit) || pageLimit <= 0) {
        return sendErrorResponse(res, 400, 'Invalid pagination parameters. Ensure both page and limit are positive integers.');
    }

    try {
        const truckLocations = await TruckLocation.find()
            .skip((pageNumber - 1) * pageLimit)
            .limit(pageLimit);

        if (!truckLocations.length) {
            return sendErrorResponse(res, 404, 'No truck locations found');
        }

        const totalLocations = await TruckLocation.countDocuments();
        const totalPages = Math.ceil(totalLocations / pageLimit);

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
