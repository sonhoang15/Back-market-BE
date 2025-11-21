// src/config/opensearchIndex.js
import { osClient } from "./opensearchClient.js";

const INDEX = "products";

export const createProductIndex = async () => {
    try {
        const exists = await osClient.indices.exists({ index: INDEX });
        if (exists.body) {
            console.log(`${INDEX} already exists`);
            return;
        }

        const mapping = {
            settings: {
                analysis: {
                    filter: {
                        vn_normalizer: {
                            type: "icu_normalizer",
                            name: "nfkc"
                        }
                    },
                    analyzer: {
                        vietnamese_analyzer: {
                            type: "custom",
                            tokenizer: "standard",
                            filter: ["lowercase", "asciifolding", "vn_normalizer"]
                        }
                    }
                }
            },
            mappings: {
                properties: {
                    id: { type: "integer" },

                    name: {
                        type: "text",
                        analyzer: "vietnamese_analyzer",
                        fields: {
                            keyword: { type: "keyword" }
                        }
                    },

                    description: {
                        type: "text",
                        analyzer: "vietnamese_analyzer"
                    },

                    brand: { type: "keyword" },

                    category_id: { type: "integer" },
                    category_name: { type: "keyword" },

                    price_min: { type: "float" },
                    price_max: { type: "float" },

                    thumbnail: { type: "keyword", "index": false },

                    totalStock: { type: "integer" },

                    variants: {
                        type: "nested",
                        properties: {
                            id: { type: "integer" },
                            color: { type: "keyword" },
                            size: { type: "keyword" },
                            price: { type: "float" },
                            stock: { type: "integer" },
                            image: { type: "keyword", index: false }
                        }
                    },

                    created_at: { type: "date" },
                    status: { type: "keyword" },

                    /* 🔥 FIX suggest -- phải là completion */
                    suggest: { type: "completion" }
                }
            }
        };

        await osClient.indices.create({
            index: INDEX,
            body: mapping
        });

        console.log("Created index:", INDEX);
    } catch (error) {
        console.error("createProductIndex error", error);
        throw error;
    }
};

export const PRODUCT_INDEX = INDEX;
