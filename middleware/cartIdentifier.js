const { v4: uuidv4 } = require("uuid");

module.exports = (req, res, next) => {
  // Logged-in user
  if (req.user) {
    req.cartQuery = { user: req.user._id };
    return next();
  }

  // Guest user
  let cartId = req.cookies.cartId;

  if (!cartId) {
    cartId = uuidv4();
    res.cookie("cartId", cartId, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
  }

  req.cartQuery = { cartId };
  next();
};
