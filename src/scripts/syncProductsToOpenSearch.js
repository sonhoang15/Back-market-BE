// src/scripts/syncProductsToOpenSearch.js
import db from "../models/index.js";
import { osClient } from "../config/opensearchClient.js";
import { PRODUCT_INDEX } from "../config/opensearchIndex.js";

const chunk = (arr, size = 500) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

export const syncProducts = async () => {
    const { Product, ProductVariant, Category } = db;

    // fetch products with variants & category
    const products = await Product.findAll({
        include: [
            { model: ProductVariant, as: "variants" },
            { model: Category, as: "category" }
        ],
        attributes: [
            "id", "name", "thumbnail", "description",
            "price_min", "price_max", "created_at", "status", "brand", "category_id"
        ],
        raw: false
    });

    const docs = products.map(p => {
        const data = p.toJSON();
        const totalStock = (data.variants || []).reduce((a, v) => a + (v.stock || 0), 0);
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            thumbnail: data.thumbnail,
            price_min: data.price_min,
            price_max: data.price_max,
            brand: data.brand || null,
            category_id: data.category_id,
            category_name: data.category?.name || null,
            variants: data.variants || [],
            totalStock,
            suggest: { input: [data.name, data.brand, data.category?.name].filter(Boolean) },
            created_at: data.created_at,
            status: data.status
        };
    });

    const chunks = chunk(docs, 500);
    for (const c of chunks) {
        const body = c.flatMap(doc => [{ index: { _index: PRODUCT_INDEX, _id: doc.id } }, doc]);
        const resp = await osClient.bulk({ refresh: true, body });
        if (resp.body.errors) {
            console.error("Some bulk indexing errors:", resp.body.items.filter(i => i.index && i.index.error));
        } else {
            console.log(`Indexed ${c.length} documents`);
        }
    }
};
