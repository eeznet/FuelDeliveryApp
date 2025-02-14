import mongoose from 'mongoose';

// Regex for basic address validation (adjust as needed)
const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;

const invoiceSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client', // Updated to reference Client model
            required: [true, 'Client ID is required'],
        },
        deliveryAddress: {
            type: String,
            required: [true, 'Delivery address is required'],
            match: [addressRegex, 'Invalid delivery address format'],
            trim: true
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
                    type: String,
                    default: null,
                    trim: true
                },
                confirmationStatus: {
                    type: String,
                    enum: ['pending', 'confirmed', 'failed'],
                    default: 'pending',
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        lastModifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

// Indexes for performance
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: 1 }); // Use timestamps for sorting

// Calculate final price after discount and tax
invoiceSchema.methods.calculateFinalPrice = function () {
    const discountAmount = (this.totalPrice * this.discount) / 100;
    const priceAfterDiscount = this.totalPrice - discountAmount;
    const taxAmount = (priceAfterDiscount * this.taxRate) / 100;
    return parseFloat((priceAfterDiscount + taxAmount).toFixed(2)); // Avoid floating point errors
};

// Virtual: Total amount paid
invoiceSchema.virtual('totalPaid').get(function () {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// Virtual: Remaining balance
invoiceSchema.virtual('remainingBalance').get(function () {
    return parseFloat((this.calculateFinalPrice() - this.totalPaid).toFixed(2));
});

// Check if invoice is fully paid
invoiceSchema.methods.isFullyPaid = function () {
    return this.totalPaid >= this.calculateFinalPrice();
};

// Pre-save hook to update status correctly
invoiceSchema.pre('save', function (next) {
    const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);

    if (totalPaid > this.calculateFinalPrice()) {
        return next(new Error('Total payments cannot exceed the final invoice price.'));
    }

    this.status = totalPaid >= this.calculateFinalPrice() ? 'paid' : 'outstanding';
    next();
});

// Method to process payments safely by the owner
invoiceSchema.methods.processPayment = async function (paymentData, user) {
    if (this.status === 'paid') {
        throw new Error('Invoice is already paid');
    }

    if (paymentData.amount !== this.totalPrice) {
        throw new Error('Payment amount must match invoice total');
    }

    if (!['cash', 'card', 'bank_transfer'].includes(paymentData.method)) {
        throw new Error('Invalid payment method');
    }

    this.payments.push({
        amount: paymentData.amount,
        method: paymentData.method,
        processedBy: user._id,
        date: new Date()
    });

    this.status = 'paid';
    await this.save();
};

// Exporting the model using ES6 default export
export default mongoose.model('Invoice', invoiceSchema);
