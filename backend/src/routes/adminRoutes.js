const express = require('express');
const router = express.Router();

const { auth, adminOnly } = require('../middleware/authMiddleware');

// Example controllers
router.get('/stats', auth, adminOnly, async (req, res) => {
    res.json({
        totalUsers: 120,
        totalOrders: 45,
        totalPets: 60
    });
});

router.get('/orders', auth, adminOnly, require('../controllers/orderController').getAllOrders);
router.get('/appointments', auth, adminOnly, require('../controllers/appointmentController').getAllAppointments);
router.get('/inventory', auth, adminOnly, require('../controllers/inventoryController').getInventory);

module.exports = router;
