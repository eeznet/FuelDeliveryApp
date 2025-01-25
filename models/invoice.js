const mongoose = require('mongoose');

// Regex for basic address validation (you can refine this pattern further)
const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;

// Define the Invoice schema
const invoiceSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for clients
            required: [true, 'Client ID is required'],
        },
        deliveryAddress: {
            type: String,
            required: [true, 'Delivery address is required'],
            match: [addressRegex, 'Invalid delivery address format'],
        },
        totalLiters: {
            type: Number,
            required: [true, 'Total liters are required'],
            min: [0.1, 'Total liters must be greater than 0.1'],
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0.1, 'Total price must be greater than 0'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
        },
        taxRate: {
            type: Number,
            default: 0,
            min: [0, 'Tax rate cannot be negative'],
        },
        status: {
            type: String,
            enum: ['paid', 'outstanding'],
            default: 'outstanding',
        },
        date: {
            type: Date,
            default: Date.now,
        },
        payments: [
            {
                amount: {
                    type: Number,
                    required: [true, 'Payment amount is required'],
                    min: [0.1, 'Payment amount must be greater than 0.1'],
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                method: {
                    type: String,
                    enum: ['cash', 'credit', 'bank'],
                    required: [true, 'Payment method is required'],
                },
                transactionReference: {
                    type: String, // Optional, to store a payment reference number
                    default: null,
                },
                confirmationStatus: {
                    type: String, // Optional, to track payment confirmation status
                    enum: ['pending', 'confirmed', 'failed'],
                    default: 'pending',
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for who created the invoice
            default: null,
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model for who last modified the invoice
            default: null,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Index for efficient client-based queries
invoiceSchema.index({ clientId: 1 });

// Method to calculate the final price after discount and tax
invoiceSchema.methods.calculateFinalPrice = function () {
    const discountAmount = (this.totalPrice * this.discount) / 100;
    const priceAfterDiscount = this.totalPrice - discountAmount;
    const taxAmount = (priceAfterDiscount * this.taxRate) / 100;
    return priceAfterDiscount + taxAmount;
};

// Virtual field to calculate the total amount paid
invoiceSchema.virtual('totalPaid').get(function () {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// **Remove the real field `remainingBalance` and keep the virtual field**
// Virtual field to calculate the remaining balance
invoiceSchema.virtual('remainingBalance').get(function () {
    return this.totalPrice - this.totalPaid;
});

// Method to check if the invoice is fully paid
invoiceSchema.methods.isFullyPaid = function () {
    return this.totalPaid >= this.totalPrice;
};

// Middleware to update status before saving
invoiceSchema.pre('save', function (next) {
    // Prevent overpayment
    if (this.totalPaid > this.totalPrice) {
        return next(new Error('Total payments cannot exceed the total invoice price.'));
    }

    // Update status based on payments
    this.status = this.isFullyPaid() ? 'paid' : 'outstanding';
    next();
});

// Method to add a payment and ensure no overpayment
invoiceSchema.methods.addPayment = function (payment) {
    const newTotalPaid = this.totalPaid + payment.amount;
    if (newTotalPaid > this.totalPrice) {
        throw new Error('Total payments cannot exceed the total invoice price.');
    }
    this.payments.push(payment);
    return this.save();
};

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
