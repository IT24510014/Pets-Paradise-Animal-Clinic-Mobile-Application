const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.checkout = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        let totalAmount = 0;

        for (const item of cart.items) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({
                    msg: `Insufficient stock for ${item.product.name}`
                });
            }
        }

        const orderItems = cart.items.map(item => {
            totalAmount += item.product.price * item.quantity;

            return {
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            };
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid order status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email role');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
