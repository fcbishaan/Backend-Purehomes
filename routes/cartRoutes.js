const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/tokenVerification");
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
} = require("../controllers/cartController");

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.put("/update", updateCartItemQuantity);

module.exports = router;
