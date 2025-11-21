import { osClient } from "../config/opensearchClient.js";
import { PRODUCT_INDEX } from "../config/opensearchIndex.js";

/**
 * searchProductsService
 * @param {Object} params 
 */
export const searchProductsService = async (params = {}) => {
    try {

        const {
            q = "",
            category,
            brand,
            color,
            size,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12,
            suggest
        } = params;

        const from = (Number(page) - 1) * Number(limit);

        if (suggest) {
            const suggestResp = await osClient.search({
                index: PRODUCT_INDEX,
                body: {
                    suggest: {
                        product_suggest: {
                            prefix: suggest,
                            completion: {
                                field: "suggest",
                                fuzzy: { fuzziness: 1 },
                                size: 8
                            }
                        }
                    }
                }
            });

            const options = suggestResp.body.suggest.product_suggest[0].options || [];
            const suggestions = options.map(o =>
                o._source ? o._source.name : o.text
            );

            return { EC: 0, EM: "OK", DT: suggestions };
        }

        const must = [];
        const filter = [];

        if (q && isNaN(q)) {
            must.push({
                "bool": {
                    "should": [
                        {
                            "match_phrase": {
                                "name": {
                                    "query": q,
                                    "boost": 10
                                }
                            }
                        },
                        {
                            "multi_match": {
                                "query": q,
                                "fields": [
                                    "name^4",
                                    "description^2",
                                    "brand"
                                ],
                                "fuzziness": "AUTO"
                            }
                        }
                    ]
                }
            })
        }

        if (q && !isNaN(q)) {
            const num = Number(q);

            filter.push({
                bool: {
                    should: [
                        { range: { price_min: { gte: num - 500000, lte: num + 500000 } } },
                        { range: { price_max: { gte: num - 500000, lte: num + 500000 } } },
                        {
                            nested: {
                                path: "variants",
                                query: {
                                    range: {
                                        "variants.price": {
                                            gte: num - 500000,
                                            lte: num + 500000
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            });
        }

        if (category) filter.push({ term: { category_id: Number(category) } });
        if (brand) filter.push({ term: { brand } });

        if (minPrice || maxPrice) {
            const range = {};
            if (minPrice) range.gte = Number(minPrice);
            if (maxPrice) range.lte = Number(maxPrice);

            filter.push({
                bool: {
                    should: [
                        { range: { price_min: range } },
                        { range: { price_max: range } },
                        {
                            nested: {
                                path: "variants",
                                query: { range: { "variants.price": range } }
                            }
                        }
                    ]
                }
            });
        }

        if (color || size) {
            const nestedQuery = { bool: { must: [] } };
            if (color) nestedQuery.bool.must.push({ term: { "variants.color": color } });
            if (size) nestedQuery.bool.must.push({ term: { "variants.size": size } });

            filter.push({
                nested: { path: "variants", query: nestedQuery }
            });
        }

        const boolQuery = {};
        if (must.length) boolQuery.must = must;
        if (filter.length) boolQuery.filter = filter;

        let sortArr;

        if (sort === "price_asc") {
            sortArr = [{ price_min: "asc" }];
        } else if (sort === "price_desc") {
            sortArr = [{ price_max: "desc" }];
        } else if (sort === "best_seller") {
            sortArr = [{ total_sold: "desc" }, { created_at: "desc" }];
        } else if (sort === "stock") {
            sortArr = [{ totalStock: "desc" }];
        } else if (q) {
            sortArr = [{ _score: "desc" }, { created_at: "desc" }];
        } else {
            sortArr = [{ created_at: "desc" }];
        }

        const resp = await osClient.search({
            index: PRODUCT_INDEX,
            body: {
                from,
                size: Number(limit),
                query: Object.keys(boolQuery).length
                    ? { bool: boolQuery }
                    : { match_all: {} },
                sort: sortArr,
                _source: [
                    "id", "name", "thumbnail", "price_min", "price_max",
                    "brand", "category_id", "category_name",
                    "totalStock", "variants", "created_at"
                ]
            }
        });

        const hits = resp.body.hits.hits.map(h => ({
            id: h._id,
            score: h._score,
            ...h._source
        }));

        const total = resp?.body?.hits?.total?.value ?? hits.length;

        return {
            EC: 0,
            EM: "OK",
            DT: {
                total,
                page: Number(page),
                limit: Number(limit),
                items: hits
            }
        };
    } catch (error) {
        console.error("searchProductsService error:", error);
        return { EC: 1, EM: "Lỗi search", DT: [] };
    }
};
