import * as productService from "../service/clientService.js";

const getProductsByCategoryAdvanced = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = req.query;
        const result = await productService.getProductsByCategoryAdvanced(category_id, query);
        return res.status(200).json(result);
    } catch (error) {
        console.error("getProductsByCategoryAdvanced error:", error);
        return res.status(500).json({ EC: 1, EM: error.message, DT: [] });
    }
};

export default {
    getProductsByCategoryAdvanced,
};
