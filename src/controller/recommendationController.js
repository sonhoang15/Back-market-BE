import { recommendByText } from "../service/recommendationService.js";

const recommendProductsController = async (req, res) => {
    try {
        const { userId, query } = req.body;

        if (userId) {
            const result = await recommendByUser(userId);
            return res.status(200).json(result);
        }

        const result = await recommendByText(
            query || "thời trang nam bán chạy"
        );

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EC: 1,
            EM: "Server error",
            DT: []
        });
    }
};


export default {
    recommendProductsController
}