const express = require('express');
const router = express.Router();

const {
    checkout,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const { auth, adminOnly } = require('../middleware/authMiddleware');

router.post('/checkout', auth, checkout);
router.get('/my-orders', auth, getMyOrders);
router.get('/', auth, adminOnly, getAllOrders);
router.put('/:id/status', auth, adminOnly, updateOrderStatus);

module.exports = router;
