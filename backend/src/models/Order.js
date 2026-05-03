const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        shippingAddress: {
            type: String,
            default: ''
        },
        paymentMethod: {
            type: String,
            default: 'Cash on Delivery'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
