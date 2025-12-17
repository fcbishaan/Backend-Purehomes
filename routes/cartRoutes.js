const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/tokenVerification");
const cartIdentifier = require("../middleware/cartIdentifier");
const {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
} = require("../controllers/cartController");

router.use(cartIdentifier);
router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.put("/update", updateQuantity);

module.exports = router;
