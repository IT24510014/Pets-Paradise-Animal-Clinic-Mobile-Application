const Product = require('../models/Product');

exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(6);
        res.json(products);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            price,
            stock,
            imageUrl,
            isFeatured
        } = req.body;

        if (!name || !category || price === undefined) {
            return res.status(400).json({ msg: 'Name, category and price are required' });
        }

        const product = await Product.create({
            name,
            category,
            description: description || '',
            price,
            stock: stock || 0,
            imageUrl: imageUrl || '',
            isFeatured: isFeatured || false
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json({ msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};