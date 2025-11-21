import CartService from "../service/cartService.js";

const getCart = async (req, res) => {
    try {
        const cart = await CartService.getCart(req.user?.user_id);
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error fetching cart" });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const result = await CartService.addToCart(req.user?.user_id, productId, variantId, quantity);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error adding to cart" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const result = await CartService.updateCartItem(itemId, quantity);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error updating cart item" });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await CartService.removeCartItem(itemId);
        res.json({ cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error removing cart item" });
    }
};

const checkoutCart = async (req, res) => {
    try {
        const order = await CartService.checkoutCart(req.user?.user_id);
        res.json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error during checkout" });
    }
};

const clearCartController = async (req, res) => {
    try {
        const { cartId } = req.params;   // ✔️ đúng tên

        const data = await CartService.clearCart(Number(cartId));

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            EC: 1,
            EM: "Server error!",
            DT: null,
        });
    }
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    checkoutCart,
    clearCartController,
}
