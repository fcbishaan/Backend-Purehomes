const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error: error.message });
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.items[productIndex].quantity = quantity;
            await cart.save();
            await cart.populate("items.product");
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating cart item", error: error.message });
    }
};
