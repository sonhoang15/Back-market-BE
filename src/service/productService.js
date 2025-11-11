import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Cấu hình Cloudinary (hoặc bạn có thể import từ file config riêng)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { Product, Product_Variant, Category } = db;

export const createProductService = async (data) => {
    try {
        let thumbnailUrl = null;

        const existing = await Product.findOne({
            where: {
                name: data.name,
                category_id: data.category_id,
            },
        });
        if (existing) {
            return {
                EC: 1,
                EM: "Sản phẩm đã tồn tại trong danh mục này",
                DT: existing,
            };
        }

        if (data.thumbnail) {
            const uploadRes = await cloudinary.uploader.upload(data.thumbnail, {
                folder: "products",
            });
            thumbnailUrl = uploadRes.secure_url;
        }

        const price_min = data.price_min || data.price || null;

        const product = await Product.create({
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            is_active: data.is_active === "true" || data.is_active === true,
            thumbnail: thumbnailUrl, // ✅ Lưu link Cloudinary
            source: "manual",
            source_type: "manual",
            sync_status: "pending",
            price_min: price_min ? Number(price_min) : null,
            price_max: null,
        });

        // ✅ Nếu có biến thể (variants)
        if (data.variants && data.variants.length > 0) {
            const variantPayload = [];

            for (const v of data.variants) {
                let imageUrl = null;

                // 🟢 Nếu có mảng ảnh base64 (images)
                if (v.images && v.images.length > 0) {
                    // Upload ảnh đầu tiên, hoặc bạn có thể upload toàn bộ nếu muốn
                    const uploadVariant = await cloudinary.uploader.upload(v.images[0], {
                        folder: "product_variants",
                    });
                    imageUrl = uploadVariant.secure_url;
                }

                variantPayload.push({
                    product_id: product.id,
                    name: `${v.color || ""}${v.size ? " - " + v.size : ""}`.trim(),
                    color: v.color ?? null,
                    size: v.size ?? null,
                    price: v.price ? Number(v.price) : null,
                    stock: v.quantity ? Number(v.quantity) : 0,
                    image: imageUrl ?? null,
                    source_type: "manual",
                    sync_status: "pending",
                });
            }

            await Product_Variant.bulkCreate(variantPayload);

            const prices = data.variants.map(v => v.price).filter(p => p != null);
            if (prices.length > 0) {
                await product.update({ price_min: Math.min(...prices) });
            }
        }

        return { EC: 0, EM: "Tạo sản phẩm thành công", DT: product };
    } catch (error) {
        console.error(" Lỗi createProductService:", error);
        return { EC: 1, EM: "Lỗi tạo sản phẩm", DT: null };
    }
};

// Lấy tất cả sản phẩm kèm biến thể
export const getAllProducts = async () => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Product_Variant, as: "variants" },
                { model: Category, as: "category" },
            ],
            order: [["id", "DESC"]],
        });

        // ✅ Thêm tổng stock, nhưng KHÔNG làm mất dữ liệu cũ
        const formatted = products.map((product) => {
            const totalStock = product.variants?.reduce(
                (acc, variant) => acc + (variant.stock || 0),
                0
            );
            // Giữ nguyên tất cả dữ liệu gốc (bao gồm ảnh, nguồn, biến thể, danh mục, v.v.)
            return {
                ...product.toJSON(),
                totalStock: totalStock || 0,
            };
        });

        return { EC: 0, EM: "Success", DT: formatted };
    } catch (error) {
        console.error("Lỗi getAllProducts:", error);
        return { EC: 1, EM: error.message, DT: [] };
    }
};


// Cập nhật sản phẩm
export const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    let thumbnailUrl = product.thumbnail;

    // ✅ Nếu có base64 mới → upload Cloudinary
    if (data.thumbnail && data.thumbnail.startsWith("data:image")) {
        const uploadRes = await cloudinary.uploader.upload(data.thumbnail, {
            folder: "products",
        });
        thumbnailUrl = uploadRes.secure_url;
    }

    await product.update({
        name: data.name ?? product.name,
        description: data.description ?? product.description,
        category_id: data.category_id ?? product.category_id,
        source: data.source ?? product.source,
        source_url: data.source_url ?? product.source_url,
        price_min: data.price_min ?? product.price_min,
        price_max: data.price_max ?? product.price_max,
        is_active: data.is_active ?? product.is_active,
        status: data.status ?? product.status,
        manual_override: data.manual_override ?? product.manual_override,
        thumbnail: thumbnailUrl,
    });
    await product.reload();
    return product;
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    await product.destroy();
    return true;
};
