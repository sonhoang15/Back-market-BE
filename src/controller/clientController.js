import * as clientService from "../service/clientService.js";
import * as searchService from "../service/searchService.js";



const getProductsByCategoryAdvanced = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = req.query;
        const result = await clientService.getProductsByCategoryAdvanced(category_id, query);
        return res.status(200).json(result);
    } catch (error) {
        console.error("getProductsByCategoryAdvanced error:", error);
        return res.status(500).json({ EC: 1, EM: error.message, DT: [] });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id; // lấy từ JWT
        let result = await clientService.getProfileService(userId);
        return res.status(200).json(result);
    } catch (e) {
        console.log(">>> getProfile error:", e);
        return res.status(500).json({ EM: "Server error", EC: -1, DT: "" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        let data = req.body;

        let result = await clientService.updateProfileService(userId, data);
        return res.status(200).json(result);
    } catch (e) {
        console.log(">>> updateProfile error:", e);
        return res.status(500).json({ EM: "Server error", EC: -1, DT: "" });
    }
};


const saveOrder = async (req, res) => {
    try {
        const userId = req.user?.user_id || null;  // ⭐ lấy user_id từ JWT

        // Gộp user_id vào payload
        const payload = {
            ...req.body,
            user_id: userId
        };

        const result = await clientService.saveOrderService(payload);

        return res.status(200).json(result);
    } catch (e) {
        console.error(">>> saveOrder error:", e);
        return res.status(500).json({ EM: "Server error", EC: -1, DT: "" });
    }
};

const getAllOrders = async (req, res) => {
    const data = await clientService.getAllOrdersService();
    return res.status(200).json(data);
};

const getOrderDetail = async (req, res) => {
    const orderId = req.params.id;
    const data = await clientService.getOrderDetailService(orderId);
    return res.status(200).json(data);
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const data = await clientService.updateOrderStatus(id, status);
        return res.status(200).json(data);

    } catch (error) {
        console.log("Error update status:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Server error",
            DT: []
        });
    }
};

const bestSeller = async (req, res) => {
    const limit = req.query.limit || 8;

    const data = await clientService.getBestSeller(limit);
    return res.status(200).json(data);
};

const newestProducts = async (req, res) => {
    const limit = req.query.limit || 8;
    const data = await clientService.getNewestProducts(limit);
    return res.status(200).json(data);

};

const searchProductsController = async (req, res) => {
    try {
        const params = req.query || {};
        const data = await searchService.searchProductsService(params);
        return res.status(200).json(data);
    } catch (e) {
        console.error("searchProductsController error:", e);
        return res.status(500).json({ EC: 1, EM: "Server error", DT: [] });
    }
};

export default {
    searchProductsController,
    bestSeller,
    newestProducts,
    getProductsByCategoryAdvanced,
    getProfile,
    updateProfile,
    saveOrder,
    getAllOrders,
    getOrderDetail,
    updateOrderStatus,
};