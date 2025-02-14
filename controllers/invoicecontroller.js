import Invoice from "../models/invoice.js";
import User from "../models/user.js";
import logger from "../config/logger.js";

// Create a New Invoice
const createInvoice = async (req, res) => {
    try {
        const { clientId, driverId, litersDelivered, pricePerLiter, address } = req.body;

        if (!clientId || !driverId || !litersDelivered || !pricePerLiter || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: clientId, driverId, litersDelivered, pricePerLiter, address."
            });
        }

        if (litersDelivered <= 0 || pricePerLiter <= 0) {
            return res.status(400).json({
                success: false,
                message: "Fuel quantity and price must be positive values."
            });
        }

        const [client, driver] = await Promise.all([
            User.findById(clientId).select("role"),
            User.findById(driverId).select("role"),
        ]);

        if (!client || client.role !== "client") {
            return res.status(404).json({ success: false, message: "Client not found or invalid role." });
        }
        if (!driver || driver.role !== "driver") {
            return res.status(404).json({ success: false, message: "Driver not found or invalid role." });
        }

        const totalPrice = litersDelivered * pricePerLiter;

        const newInvoice = new Invoice({
            clientId,
            driverId,
            litersDelivered,
            pricePerLiter,
            totalPrice,
            address,
            date: new Date(),
        });

        await newInvoice.save();
        logger.info(`✅ Invoice created: ${clientId} - ${driverId} - Total: ${totalPrice}`);
        res.status(201).json({
            success: true,
            message: "Invoice created successfully.",
            invoice: newInvoice
        });
    } catch (error) {
        logger.error(`❌ Error creating invoice: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Get All Invoices with Pagination (Owner/Admin Only)
const getAllInvoices = async (req, res) => {
    try {
        if (!["owner", "admin"].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const { page = 1, limit = 10 } = req.query;
        const invoices = await Invoice.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("clientId driverId", "email role name phone");

        if (!invoices.length) {
            return res.status(404).json({ success: false, message: "No invoices found." });
        }

        logger.info(`✅ Retrieved ${invoices.length} invoices for owner/admin.`);
        res.status(200).json({
            success: true,
            message: "Invoices retrieved successfully.",
            invoices
        });
    } catch (error) {
        logger.error(`❌ Error retrieving invoices: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Get Invoices for a Specific Client with Pagination
const getClientInvoices = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const client = await User.findById(clientId).select("role");
        if (!client || client.role !== "client") {
            return res.status(404).json({ success: false, message: "Client not found or invalid role." });
        }

        const invoices = await Invoice.find({ clientId })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate("driverId", "email name");

        if (!invoices.length) {
            return res.status(404).json({ success: false, message: "No invoices found for this client." });
        }

        logger.info(`✅ Retrieved ${invoices.length} invoices for client ${clientId}.`);
        res.status(200).json({
            success: true,
            message: "Client invoices retrieved successfully.",
            invoices
        });
    } catch (error) {
        logger.error(`❌ Error retrieving client invoices: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Update Invoice (Owner Only)
const updateInvoice = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const { invoiceId } = req.params;
        const { litersDelivered, pricePerLiter, address } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found." });
        }

        if (litersDelivered !== undefined) invoice.litersDelivered = litersDelivered;
        if (pricePerLiter !== undefined) invoice.pricePerLiter = pricePerLiter;
        if (address) invoice.address = address;
        invoice.totalPrice = invoice.litersDelivered * invoice.pricePerLiter;

        await invoice.save();
        logger.info(`✅ Invoice updated: ${invoiceId} - New Total: ${invoice.totalPrice}`);
        res.status(200).json({
            success: true,
            message: "Invoice updated successfully.",
            invoice
        });
    } catch (error) {
        logger.error(`❌ Error updating invoice: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Delete Invoice (Owner Only)
const deleteInvoice = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const { invoiceId } = req.params;
        const invoice = await Invoice.findByIdAndDelete(invoiceId);

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found." });
        }

        logger.info(`✅ Invoice deleted: ${invoiceId}`);
        res.status(200).json({ success: true, message: "Invoice deleted successfully." });
    } catch (error) {
        logger.error(`❌ Error deleting invoice: ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
};

// Process Payment
const processPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await invoice.processPayment(req.body, req.user);

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully'
        });
    } catch (error) {
        logger.error(`❌ Payment processing error: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Export all functions
export {
    createInvoice,
    getAllInvoices,
    getClientInvoices,
    updateInvoice,
    deleteInvoice,
    processPayment
};
