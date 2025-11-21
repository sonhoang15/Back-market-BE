// service/productService.js
import db from "../models/index.js";
const { Product, ProductVariant, Category, Order, OrderItem } = db;

export const getProductsByCategoryAdvanced = async (category_id, query) => {
    try {
        if (!category_id) return { EC: 1, EM: "Thiếu category_id", DT: [] };

        const { page = 1, limit = 10, color, size, minPrice, maxPrice, sort } = query;
        const offset = (page - 1) * limit;

        const variantWhere = {};
        if (color) variantWhere.color = color;
        if (size) variantWhere.size = size;
        if (minPrice) variantWhere.price = { ...variantWhere.price, $gte: Number(minPrice) };
        if (maxPrice) variantWhere.price = { ...variantWhere.price, $lte: Number(maxPrice) };

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
                    attributes: [
                        "id",
                        "color",
                        "size",
                        "price",
                        "stock",
                        "image",
                    ]
                },
                {
                    model: Category,
                    as: "category"
                }
            ],
            attributes: [
                "id",
                "name",
                "thumbnail",       // ảnh chính
                "description",     // mô tả
                "price_min",
                "price_max",
                "status"
            ],
            order: [["id", "DESC"]]
        });

        const formatted = products.map((p) => {
            const data = p.toJSON();
            const totalStock = data.variants?.reduce((acc, v) => acc + (v.stock || 0), 0);

            return {
                ...data,
                totalStock: totalStock || 0,
            };
        });

        return { EC: 0, EM: "Success", DT: formatted };
    } catch (error) {
        console.error("Lỗi getProductsByCategoryAdvanced:", error);
        return { EC: 1, EM: error.message, DT: [] };
    }
};

export const getProfileService = async (userId) => {
    let user = await db.User.findOne({
        where: { id: userId },
        attributes: [
            "id",
            "email",
            "username",
            "birthday",
            "address",
            "phone",
            "province",
            "district",
            "ward"
        ]
    });

    if (!user) {
        return {
            EM: "User not found",
            EC: 1,
            DT: null
        };
    }

    return {
        EM: "Get profile success",
        EC: 0,
        DT: user
    };
};

export const updateProfileService = async (userId, data) => {
    let user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
        return { EM: "User not found", EC: 1, DT: null };
    }

    await user.update(data);

    return { EM: "Update profile success", EC: 0, DT: user };
};

export const saveOrderService = async (data) => {
    try {
        const {
            user_id,
            email,
            username,
            phone,
            address,
            province,
            district,
            ward,
            note,
            payment,
            items,
            total
        } = data;

        if (!items || items.length === 0) {
            return { EC: 1, EM: "Không có sản phẩm trong đơn hàng", DT: null };
        }

        const order = await Order.create({
            user_id: user_id || null,
            email,
            username,
            phone,
            address,
            province,
            district,
            ward,
            note,
            payment,
            total_price: total,
            status: "pending"
        });

        for (const item of items) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price || 0,
                total_price: item.quantity * (item.price || 0)
            });
        }

        return {
            EC: 0,
            EM: "Tạo đơn hàng thành công",
            DT: order
        };

    } catch (error) {
        console.error("🔥 Lỗi saveOrderService:", error);
        return {
            EC: 1,
            EM: "Lỗi server khi tạo đơn hàng",
            DT: null
        };
    }
};

export const getAllOrdersService = async () => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: db.OrderItem,
                    as: "items",
                    include: [
                        { model: db.Product, as: "product" },
                        { model: db.ProductVariant, as: "variant" }
                    ]
                }
            ],
            order: [["id", "DESC"]]
        });

        return {
            EC: 0,
            DT: orders
        };
    } catch (e) {
        console.error(e);
        return {
            EC: 1,
            EM: "Lỗi server",
            DT: null
        };
    }
};

export const getOrderDetailService = async (orderId) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId },
            include: [
                {
                    model: db.OrderItem,
                    as: "items",
                    include: [
                        { model: db.Product, as: "product" },
                        { model: db.ProductVariant, as: "variant" }
                    ]
                }
            ]
        });

        if (!order) {
            return { EC: 2, EM: "Không tìm thấy đơn hàng", DT: null };
        }

        return {
            EC: 0,
            DT: order
        };
    } catch (e) {
        console.error(e);
        return { EC: 1, EM: "Lỗi server", DT: null };
    }
};

export const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
        return { EC: 1, EM: "Order not found", DT: null };
    }

    order.status = status;
    await order.save();

    return { EC: 0, EM: "Cập nhật trạng thái thành công", DT: order };
};


export const getBestSeller = async () => {
    try {
        const bestSellerRaw = await OrderItem.findAll({
            attributes: [
                "product_id",
                [db.sequelize.fn("SUM", db.sequelize.col("quantity")), "total_sold"],
            ],
            group: ["product_id"],
            order: [[db.sequelize.literal("total_sold"), "DESC"]],
            limit: 8,
        });

        const results = await Promise.all(
            bestSellerRaw.map(async (item) => {
                const product = await Product.findOne({
                    where: { id: item.product_id },
                    include: [
                        {
                            model: ProductVariant,
                            as: "variants",
                            attributes: [
                                "id",
                                "color",
                                "size",
                                "price",
                                "image",
                                "stock"
                            ]
                        }
                    ]
                });

                const variantImage =
                    product?.variants?.find(v => v.image) ||
                    product?.variants?.[0] ||
                    null;

                return {
                    ...product.toJSON(),
                    total_sold: item.dataValues.total_sold,
                    variant_image: variantImage?.image || product.thumbnail,
                };
            })
        );

        return {
            EC: 0,
            EM: "OK",
            DT: results,
        };
    } catch (error) {
        console.error(error);
        return { EC: 1, EM: "Lỗi service", DT: [] };
    }
};

export const getNewestProducts = async (limit = 8) => {
    try {
        const products = await Product.findAll({
            limit: 8,
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: ProductVariant,
                    as: "variants",
                    required: false, // <--- LEFT JOIN để không lọc mất sản phẩm
                },
            ],
        });

        return {
            EC: 0,
            EM: "OK",
            DT: products,
        };
    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: "Lỗi server",
            DT: [],
        };
    }
};