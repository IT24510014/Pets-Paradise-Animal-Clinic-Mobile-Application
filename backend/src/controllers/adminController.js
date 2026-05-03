const User = require('../models/User');
const Order = require('../models/Order');
const Pet = require('../models/Pet');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalPets = await Pet.countDocuments();

        res.json({
            totalUsers,
            totalOrders,
            totalPets
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
