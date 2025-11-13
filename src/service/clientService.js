// service/productService.js
import db from "../models/index.js";
const { Product, ProductVariant, Category } = db;

export const getProductsByCategoryAdvanced = async (category_id, query) => {
    try {
        if (!category_id) return { EC: 1, EM: "Thiếu category_id", DT: [] };

        const { page = 1, limit = 10, color, size, minPrice, maxPrice, sort } = query;
        const offset = (page - 1) * limit;

        // Build filter cho variants
        const variantWhere = {};
        if (color) variantWhere.color = color;
        if (size) variantWhere.size = size;
        if (minPrice) variantWhere.price = { ...variantWhere.price, $gte: Number(minPrice) };
        if (maxPrice) variantWhere.price = { ...variantWhere.price, $lte: Number(maxPrice) };

        // Build sort
        let order = [["id", "DESC"]];
        if (sort === "price_asc") order = [[ProductVariant, "price", "ASC"]];
        else if (sort === "price_desc") order = [[ProductVariant, "price", "DESC"]];
        else if (sort === "newest") order = [["created_at", "DESC"]];

        const products = await Product.findAll({
            where: { category_id },
            include: [
                {
                    model: ProductVariant,
                    as: "variants",
                    where: Object.keys(variantWhere).length > 0 ? variantWhere : undefined,
                    required: false // nếu filter mà không có variant vẫn hiển thị product
                },
                { model: Category, as: "category" },
            ],
            order,
            offset: Number(offset),
            limit: Number(limit),
        });

        const formatted = products.map((product) => {
            const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0);
            return {
                ...product.toJSON(),
                totalStock: totalStock || 0,
            };
        });

        return { EC: 0, EM: "Success", DT: formatted };
    } catch (error) {
        console.error("Lỗi getProductsByCategoryAdvanced:", error);
        return { EC: 1, EM: error.message, DT: [] };
    }
};
