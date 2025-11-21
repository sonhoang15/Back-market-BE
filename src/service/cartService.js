import db from "../models/index.js";
const { Cart, CartItem, Product, ProductVariant, Order, OrderItem } = db;

class CartService {
    // Lấy giỏ hàng hiện tại của user
    static async getCart(userId) {
        let cart = await Cart.findOne({
            where: {
                user_id: userId,
                status: "active"
            },
            include: [
                {
                    model: CartItem,
                    as: "items",
                    include: [
                        { model: Product, as: "product" },
                        {
                            model: ProductVariant,
                            as: "variant",
                            attributes: ["id", "name", "size", "image"] // <- thêm size và image
                        },
                    ],
                },
            ],
        });

        if (!cart) {
            cart = await Cart.create({ user_id: userId, status: "active" });
        }
        if (!cart.status) {
            cart.status = "active";
            await cart.save();
        }

        return cart;
    }

    // Thêm sản phẩm vào giỏ hàng
    static async addToCart(userId, productId, variantId, quantity) {
        let cart = await Cart.findOne({ where: { user_id: userId, status: "active" } });
        if (!cart) cart = await Cart.create({ user_id: userId });

        let item = await CartItem.findOne({
            where: { cart_id: cart.id, product_id: productId, variant_id: variantId || null },
        });

        const product = await Product.findByPk(productId);
        const price = variantId ? (await ProductVariant.findByPk(variantId)).price : product.price;

        if (item) {
            item.quantity += quantity;
            item.price = price;
            item.total_price = item.quantity * price;
            await item.save();
        } else {
            item = await CartItem.create({
                cart_id: cart.id,
                product_id: productId,
                variant_id: variantId || null,
                quantity,
                price,
                total_price: quantity * price,
            });
        }

        await CartService.updateCartTotal(cart.id);
        return await CartService.getCart(userId);
    }

    // Cập nhật tổng tiền và tổng items của giỏ
    static async updateCartTotal(cartId) {
        const cart = await Cart.findByPk(cartId);
        const cartItems = await CartItem.findAll({ where: { cart_id: cartId } });

        cart.total_price = cartItems.reduce((sum, i) => sum + parseFloat(i.total_price), 0);
        cart.total_items = cartItems.reduce((sum, i) => sum + i.quantity, 0);
        await cart.save();

        return cart;
    }

    // Cập nhật số lượng item
    static async updateCartItem(itemId, quantity) {
        const item = await CartItem.findByPk(itemId);
        if (!item) throw new Error("Cart item not found");

        item.quantity = quantity;
        item.total_price = item.price * quantity;
        await item.save();

        const cart = await CartService.updateCartTotal(item.cart_id);
        return { cart, item };
    }

    // Xóa item khỏi giỏ
    static async removeCartItem(itemId) {
        const item = await CartItem.findByPk(itemId);
        if (!item) throw new Error("Cart item not found");

        const cartId = item.cart_id;
        await item.destroy();

        const cart = await CartService.updateCartTotal(cartId);
        return cart;
    }

    // Checkout
    static async checkoutCart(userId) {
        const cart = await Cart.findOne({
            where: { user_id: userId, status: "active" },
            include: [{ model: CartItem, as: "items" }],
        });

        if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

        const order = await Order.create({
            user_id: userId,
            total_price: cart.total_price,
            total_items: cart.total_items,
            status: "pending",
        });

        for (const item of cart.items) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price,
            });
        }

        cart.status = "checked_out";
        await cart.save();

        return order;
    }
    static async clearCart(cartId) {
        try {
            // Xóa toàn bộ CartItem thuộc giỏ hàng này
            await CartItem.destroy({
                where: { cart_id: cartId }
            });

            // Cập nhật lại tổng tiền giỏ hàng về 0
            const cart = await Cart.findByPk(cartId);
            if (cart) {
                cart.total_price = 0;
                cart.total_items = 0;
                await cart.save();
            }

            return {
                EC: 0,
                EM: "Xóa giỏ hàng thành công!",
                DT: cart
            };
        } catch (error) {
            console.error("clearCart error:", error);
            return {
                EC: 1,
                EM: "Lỗi khi xóa giỏ hàng!",
                DT: null
            };
        }
    }
}

export default CartService;
