import mongoose from 'mongoose';
import geolib from 'geolib'; // Library for geospatial calculations

// Define the TruckLocation schema
const truckLocationSchema = new mongoose.Schema(
    {
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for drivers
            required: [true, 'Driver ID is required'],
        },
        location: {
            type: { type: String, enum: ['Point'], required: true },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: [true, 'Coordinates are required'],
                validate: {
                    validator: function (v) {
                        return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
                    },
                    message: 'Invalid coordinates',
                },
            },
        },
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
            min: 0,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Geospatial index for location-based queries
truckLocationSchema.index({ location: '2dsphere' });

// Index for fast lookups by driver
truckLocationSchema.index({ driverId: 1 });

// Middleware to track location changes and calculate distance traveled
truckLocationSchema.pre('save', function (next) {
    if (this.isModified('location')) {
        const lastLocation = this.locationHistory[this.locationHistory.length - 1];

        // Only add new location if it's different from the last recorded location
        if (!lastLocation || (lastLocation.coordinates[0] !== this.location.coordinates[0] || lastLocation.coordinates[1] !== this.location.coordinates[1])) {
            
            // Calculate distance if there is a previous location
            if (lastLocation) {
                const distance = geolib.getDistance(
                    { latitude: lastLocation.coordinates[1], longitude: lastLocation.coordinates[0] },
                    { latitude: this.location.coordinates[1], longitude: this.location.coordinates[0] }
                ) / 1000; // Convert meters to kilometers

                this.totalDistanceTraveled += distance;
            }

            // Add new location to history
            this.locationHistory.push({
                coordinates: this.location.coordinates,
                timestamp: new Date(),
            });

            // Limit history to 100 records
            const MAX_HISTORY = 100;
            if (this.locationHistory.length > MAX_HISTORY) {
                this.locationHistory.shift();
            }
        }
    }
    next();
});

// Create and export the TruckLocation model
const TruckLocation = mongoose.model('TruckLocation', truckLocationSchema);
export default TruckLocation;
