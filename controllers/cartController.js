const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne(req.cartQuery)
      .populate("items.product");

    if (!cart) {
      cart = await Cart.create({ ...req.cartQuery, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne(req.cartQuery);

    if (!cart) {
      cart = await Cart.create({ ...req.cartQuery, items: [] });
    }

    const item = cart.items.find(
      i => i.product.toString() === productId
    );

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Add to cart failed" });
  }
};


exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne(req.cartQuery);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    i => i.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product");

  res.json(cart);
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const cart = await Cart.findOne(req.cartQuery);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    i => i.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");

  res.json(cart);
};
