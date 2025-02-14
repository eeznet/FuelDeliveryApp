const Price = require('../models/price');  
const User = require('../models/user');    
const mongoose = require('mongoose');

// Utility function for price data validation
const validatePriceData = (fuelType, price) => {
    const validFuelTypes = ['93', '95', 'diesel'];
    if (!fuelType || price === undefined) {
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

// Middleware for owner role check
const checkOwnerRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Access denied: Owner role required' });
    }
    next();
};

// Get all fuel prices
const getAllPrices = async (req, res) => {
    try {
        const prices = await Price.find();
        if (!prices.length) {
            return res.status(204).json({ success: false, message: "No fuel prices found" });
        }
        console.log('Fetched all fuel prices');  
        res.status(200).json({ success: true, data: prices });
    } catch (err) {
        console.error("Error fetching prices:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Add a new fuel price
const addPrice = async (req, res) => {
    const { fuelType, price } = req.body;

    try {
        checkOwnerRole(req, res, () => {});  // Ensuring middleware is called

        const validationError = validatePriceData(fuelType, price);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const existingPrice = await Price.findOne({ fuelType });
        if (existingPrice) {
            return res.status(400).json({ success: false, message: `Price for ${fuelType} already exists.` });
        }

        const newPrice = new Price({ fuelType, price });
        await newPrice.save();

        console.log(`Price added for ${fuelType}: $${price}`);  
        res.status(201).json({ success: true, data: newPrice });
    } catch (err) {
        console.error(`Error adding price for ${fuelType}:`, err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update an existing fuel price
const updatePrice = async (req, res) => {
    const { id } = req.params;
    const { fuelType, price } = req.body;

    try {
        checkOwnerRole(req, res, () => {}); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid price ID" });
        }

        const validationError = validatePriceData(fuelType, price);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const updatedPrice = await Price.findByIdAndUpdate(
            id, 
            { fuelType, price },
            { new: true }  
        );

        if (!updatedPrice) {
            return res.status(404).json({ success: false, message: "Price not found" });
        }

        console.log(`Price updated for ${fuelType}: $${price}`);  
        res.json({ success: true, data: updatedPrice });
    } catch (err) {
        console.error(`Error updating price:`, err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a price
const deletePrice = async (req, res) => {
    const { id } = req.params;

    try {
        checkOwnerRole(req, res, () => {}); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid price ID" });
        }

        const deletedPrice = await Price.findByIdAndDelete(id);
        if (!deletedPrice) {
            return res.status(404).json({ success: false, message: "Price not found" });
        }

        console.log(`Price for ${deletedPrice.fuelType} deleted`);  
        res.json({ success: true, message: "Price deleted successfully" });
    } catch (err) {
        console.error(`Error deleting price:`, err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getAllPrices,
    addPrice,
    updatePrice,
    deletePrice
};
