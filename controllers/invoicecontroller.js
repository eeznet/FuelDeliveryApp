const Invoice = require('../models/invoice');
const User = require('../models/user'); // Assuming all users are stored here

// Create a New Invoice
exports.createInvoice = async (req, res) => {
    const { clientId, driverId, litersDelivered, pricePerLiter, address } = req.body;

    // Validate required fields
    if (!clientId || !driverId || !litersDelivered || !pricePerLiter || !address) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate that litersDelivered and pricePerLiter are positive numbers
    if (litersDelivered <= 0 || pricePerLiter <= 0) {
        return res.status(400).json({ success: false, message: 'Fuel quantity and price must be positive values.' });
    }

    try {
        const [client, driver] = await Promise.all([
            User.findById(clientId),
            User.findById(driverId),
        ]);

        // Validate client and driver
        if (!client || client.role !== 'client') {
            return res.status(404).json({ success: false, message: 'Invalid client.' });
        }
        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ success: false, message: 'Invalid driver.' });
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
        res.status(201).json({
            success: true,
            message: 'Invoice created successfully.',
            invoice: newInvoice,
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// Get All Invoices with Pagination (Owner/Admin Only)
exports.getAllInvoices = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        if (!['owner', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        const invoices = await Invoice.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('clientId driverId', 'email role name phone'); // Added extra fields for user details

        if (!invoices.length) {
            return res.status(404).json({ success: false, message: 'No invoices found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Invoices retrieved successfully.',
            invoices,
        });
    } catch (error) {
        console.error('Error retrieving invoices:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// Get Invoices for a Specific Client
exports.getClientInvoices = async (req, res) => {
    const { clientId } = req.params;

    try {
        const client = await User.findById(clientId);

        // Validate client
        if (!client || client.role !== 'client') {
            return res.status(404).json({ success: false, message: 'Invalid client.' });
        }

        const invoices = await Invoice.find({ clientId }).populate('driverId', 'email name');
        if (!invoices.length) {
            return res.status(404).json({ success: false, message: 'No invoices found for this client.' });
        }

        res.status(200).json({
            success: true,
            message: 'Client invoices retrieved successfully.',
            invoices,
        });
    } catch (error) {
        console.error('Error retrieving client invoices:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// Update Invoice (Owner Only)
exports.updateInvoice = async (req, res) => {
    const { invoiceId } = req.params;
    const { litersDelivered, pricePerLiter, address } = req.body;

    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        const invoice = await Invoice.findById(invoiceId);

        // Validate invoice
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }

        if (litersDelivered !== undefined) invoice.litersDelivered = litersDelivered;
        if (pricePerLiter !== undefined) invoice.pricePerLiter = pricePerLiter;
        if (address) invoice.address = address;

        invoice.totalPrice = invoice.litersDelivered * invoice.pricePerLiter;

        await invoice.save();
        res.status(200).json({
            success: true,
            message: 'Invoice updated successfully.',
            invoice,
        });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};

// Delete Invoice (Owner Only)
exports.deleteInvoice = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        const invoice = await Invoice.findByIdAndDelete(invoiceId);

        // Validate invoice
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' });
        }

        res.status(200).json({ success: true, message: 'Invoice deleted successfully.' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
};
