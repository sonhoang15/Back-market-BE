import { osClient } from "../config/opensearchClient.js";

export async function ensureProductIndex() {
    const indexName = "products";

    const exists = await osClient.indices.exists({ index: indexName });
    if (exists.body) {
        console.log("Index already exists:", indexName);
        return;
    }

    await osClient.indices.create({
        index: indexName,
        body: {
            settings: {
                analysis: {
                    filter: {
                        vietnamese_stop: {
                            type: "stop",
                            stopwords: "_vietnamese_"
                        }
                    },
                    analyzer: {
                        vietnamese_analyzer: {
                            type: "custom",
                            tokenizer: "standard",
                            filter: [
                                "lowercase",
                                "asciifolding",
                                "vietnamese_stop"
                            ]
                        }
                    }
                }
            },
            mappings: {
                properties: {
                    id: { type: "integer" },

                    name: { type: "text", analyzer: "vietnamese_analyzer" },
                    description: { type: "text", analyzer: "vietnamese_analyzer" },

                    brand: { type: "keyword" },

                    category_id: { type: "integer" },
                    category_name: { type: "keyword" },

                    thumbnail: { type: "keyword", index: false },

                    price_min: { type: "float" },
                    price_max: { type: "float" },

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
                    updated_at: { type: "date" }
                }
            }
        }
    });

    console.log("Created index with Vietnamese analyzer:", indexName);
}
