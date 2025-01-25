const mongoose = require('mongoose');
const geolib = require('geolib'); // Library for geospatial calculations

// Define the TruckLocation schema
const truckLocationSchema = new mongoose.Schema(
    {
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for drivers
            required: [true, 'Driver ID is required'],
            validate: {
                validator: async function (value) {
                    // Ensure the driverId exists in the User collection
                    const driverExists = await mongoose.model('User').exists({ _id: value });
                    if (!driverExists) {
                        throw new Error('Driver ID does not exist.');
                    }
                    return true;
                },
                message: 'Invalid driver ID',
            },
        },
        // Current location stored using GeoJSON format
        location: {
            type: { type: String, enum: ['Point'], required: true },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: [true, 'Coordinates are required'],
                validate: {
                    validator: function (v) {
                        // Validate longitude and latitude ranges
                        return v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
                    },
                    message: 'Invalid coordinates',
                },
            },
        },
        updatedAt: {
            type: Date,
            default: Date.now, // Updates whenever location is modified
        },
        // History of locations with timestamps
        locationHistory: [
            {
                coordinates: {
                    type: [Number],
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        totalDistanceTraveled: {
            type: Number,
            default: 0, // in kilometers
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Geospatial index for location-based queries
truckLocationSchema.index({ location: '2dsphere' });

// Middleware to track location changes and calculate distance traveled
truckLocationSchema.pre('save', function (next) {
    if (this.isModified('location')) {
        const previousLocation = this.locationHistory[this.locationHistory.length - 1];

        // Check if this is the first location update
        if (!previousLocation) {
            this.totalDistanceTraveled = 0; // Ensure no distance is added if it's the first record
        } else {
            // Calculate distance if there is a previous location
            const distance = geolib.getDistance(
                { latitude: previousLocation.coordinates[1], longitude: previousLocation.coordinates[0] },
                { latitude: this.location.coordinates[1], longitude: this.location.coordinates[0] }
            );
            this.totalDistanceTraveled += distance / 1000; // Convert meters to kilometers
        }

        // Add the current location to the history
        this.locationHistory.push({
            coordinates: this.location.coordinates,
            timestamp: new Date(),
        });

        // Update the `updatedAt` field
        this.updatedAt = new Date();
    }
    next();
});

// Create and export the TruckLocation model
const TruckLocation = mongoose.model('TruckLocation', truckLocationSchema);

module.exports = TruckLocation;
