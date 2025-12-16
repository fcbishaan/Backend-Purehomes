const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/tokenVerification");
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
} = require("../controllers/cartController");

router.get("/", isLoggedIn, getCart);
router.post("/add", isLoggedIn, addToCart);
router.delete("/remove/:productId", isLoggedIn, removeFromCart);
router.put("/update", isLoggedIn, updateCartItemQuantity);

module.exports = router;
