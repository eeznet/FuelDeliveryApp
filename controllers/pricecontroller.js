const Price = require('../models/price');  // Import the Price model

// Utility function for price data validation
const validatePriceData = (fuelType, price) => {
    const validFuelTypes = ['93', '95', 'diesel'];
    if (!fuelType || !price) {
        return "Fuel type and price are required.";
    }
    if (isNaN(price) || price <= 0) {
        return "Price must be a positive number.";
    }
    if (!validFuelTypes.includes(fuelType)) {
        return "Invalid fuel type.";
    }
    return null; // No errors
};

// Get all fuel prices
const getAllPrices = async (req, res) => {
    try {
        const prices = await Price.find();
        if (!prices.length) {
            return res.status(204).json({ message: "No fuel prices found" });
        }
        res.json({ success: true, data: prices });
    } catch (err) {
        console.error("Error fetching prices:", err);
        res.status(500).json({ success: false, message: "Error fetching prices", error: err.message });
    }
};

// Add a new fuel price
const addPrice = async (req, res) => {
    const { fuelType, price } = req.body;

    // Validate the price data
    const validationError = validatePriceData(fuelType, price);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    try {
        const existingPrice = await Price.findOne({ fuelType });
        if (existingPrice) {
            return res.status(400).json({ success: false, message: `Price for ${fuelType} already exists.` });
        }

        const newPrice = new Price({ fuelType, price });
        await newPrice.save();

        res.status(201).json({ success: true, data: newPrice });
    } catch (err) {
        console.error(`Error adding price for ${fuelType}:`, err);
        res.status(500).json({ success: false, message: "Error adding price", error: err.message });
    }
};

// Update an existing fuel price
const updatePrice = async (req, res) => {
    const { id } = req.params;
    const { fuelType, price } = req.body;

    // Validate the price data
    const validationError = validatePriceData(fuelType, price);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    try {
        const updatedPrice = await Price.findByIdAndUpdate(
            id, 
            { fuelType, price },
            { new: true }  // Return the updated document
        );

        if (!updatedPrice) {
            return res.status(404).json({ success: false, message: "Price not found" });
        }

        res.json({ success: true, data: updatedPrice });
    } catch (err) {
        console.error(`Error updating price for ${fuelType}:`, err);
        res.status(500).json({ success: false, message: "Error updating price", error: err.message });
    }
};

// Delete a price
const deletePrice = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPrice = await Price.findByIdAndDelete(id);

        if (!deletedPrice) {
            return res.status(404).json({ success: false, message: "Price not found" });
        }

        res.json({ success: true, message: "Price deleted successfully" });
    } catch (err) {
        console.error(`Error deleting price:`, err);
        res.status(500).json({ success: false, message: "Error deleting price", error: err.message });
    }
};

module.exports = {
    getAllPrices,
    addPrice,
    updatePrice,
    deletePrice
};
