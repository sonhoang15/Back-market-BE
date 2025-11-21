import db from "../models/index.js";
import { osClient } from "../config/opensearchClient.js";
import { PRODUCT_INDEX } from "../config/opensearchIndex.js";

export async function syncProductsToOpenSearch() {
    console.log("⏳ Syncing MySQL → OpenSearch...");

    const products = await db.Product.findAll({
        include: [
            { model: db.ProductVariant, as: "variants", raw: true },
            { model: db.Category, as: "category", raw: true }
        ]
    });

    if (!products.length) {
        console.log(" Không có sản phẩm nào trong MySQL");
        return;
    }

    const body = [];

    for (const product of products) {
        const p = product.toJSON();

        const variants = (p.variants || []).map(v => ({
            id: v.id,
            color: v.color,
            size: v.size,
            price: parseFloat(v.price),
            image: v.image,
            stock: v.stock
        }));

        const suggest = {
            input: [
                p.name,
                p.brand,
                p.category?.name,
                ...(variants.map(v => v.color)),
                ...(variants.map(v => v.size))
            ].filter(Boolean),
            weight: 10
        };

        body.push(
            { index: { _index: PRODUCT_INDEX, _id: p.id } },
            {
                id: p.id,
                name: p.name,
                description: p.description || "",
                thumbnail: p.thumbnail,
                brand: p.brand || "",
                category_id: p.category_id,
                category_name: p.category?.name || "",
                price_min: parseFloat(p.price_min),
                price_max: parseFloat(p.price_max),
                variants,
                totalStock: variants.reduce((t, v) => t + (v.stock || 0), 0),
                suggest,
                created_at: p.created_at,
                updated_at: p.updated_at
            }
        );
    }

    const response = await osClient.bulk({ refresh: true, body });

    if (response.body.errors) {
        console.error(" Bulk error:", response.body.items);
        return;
    }

    console.log(` Synced ${products.length} products → OpenSearch`);
}
