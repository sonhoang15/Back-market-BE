import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";



const { Product, ProductVariant, Category } = db;
// ✅ Cấu hình Cloudinary (hoặc bạn có thể import từ file config riêng)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000 // 60 giây (mặc định là 30s)
});

// 🔹 Hàm upload với retry
const uploadWithRetry = async (image, folder, retries = 3, delay = 2000) => {
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            const result = await cloudinary.uploader.upload(image, {
                folder,
                timeout: 60000,
                quality: 'auto:good', // Giảm chất lượng để upload nhanh hơn
                fetch_format: 'auto'
            });
            return result;
        } catch (error) {
            lastError = error;
            console.warn(`Upload attempt ${i + 1} failed:`, error.message);

            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError;
};

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

        // 🔹 Upload thumbnail với retry
        if (data.thumbnail) {
            try {
                const uploadRes = await uploadWithRetry(data.thumbnail, "products");
                thumbnailUrl = uploadRes.secure_url;
            } catch (uploadError) {
                console.error("Lỗi upload thumbnail:", uploadError);
                return {
                    EC: 1,
                    EM: "Lỗi upload ảnh đại diện. Vui lòng thử lại với ảnh nhỏ hơn.",
                    DT: null
                };
            }
        }

        const price_min = data.price_min || data.price || null;

        const product = await Product.create({
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            is_active: data.is_active === "true" || data.is_active === true,
            thumbnail: thumbnailUrl,
            source: "manual",
            source_type: "manual",
            sync_status: "pending",
            price_min: price_min ? Number(price_min) : null,
            price_max: null,
        });

        // 🔹 Xử lý variants với upload song song và retry
        if (data.variants && data.variants.length > 0) {
            const variantPayload = [];
            const uploadPromises = [];

            // Tạo tất cả upload promises
            for (const v of data.variants) {
                if (v.images && v.images.length > 0) {
                    const uploadPromise = uploadWithRetry(v.images[0], "product_variants")
                        .then(uploadResult => {
                            variantPayload.push({
                                product_id: product.id,
                                name: `${v.color || ""}${v.size ? " - " + v.size : ""}`.trim(),
                                color: v.color ?? null,
                                size: v.size ?? null,
                                price: v.price ? Number(v.price) : null,
                                stock: v.quantity ? Number(v.quantity) : 0,
                                image: uploadResult.secure_url,
                                source_type: "manual",
                                sync_status: "pending",
                                is_active: true,
                            });
                        })
                        .catch(error => {
                            console.error(`Lỗi upload ảnh variant:`, error);
                            // Vẫn tạo variant nhưng không có ảnh
                            variantPayload.push({
                                product_id: product.id,
                                name: `${v.color || ""}${v.size ? " - " + v.size : ""}`.trim(),
                                color: v.color ?? null,
                                size: v.size ?? null,
                                price: v.price ? Number(v.price) : null,
                                stock: v.quantity ? Number(v.quantity) : 0,
                                image: null,
                                source_type: "manual",
                                sync_status: "pending",
                                is_active: true,
                            });
                        });

                    uploadPromises.push(uploadPromise);
                } else {
                    // Variant không có ảnh
                    variantPayload.push({
                        product_id: product.id,
                        name: `${v.color || ""}${v.size ? " - " + v.size : ""}`.trim(),
                        color: v.color ?? null,
                        size: v.size ?? null,
                        price: v.price ? Number(v.price) : null,
                        stock: v.quantity ? Number(v.quantity) : 0,
                        image: null,
                        source_type: "manual",
                        sync_status: "pending",
                        is_active: true,
                    });
                }
            }

            // 🔹 Chờ tất cả upload hoàn thành
            await Promise.all(uploadPromises);

            try {
                await ProductVariant.bulkCreate(variantPayload);
            } catch (bulkError) {
                console.error("Lỗi khi tạo biến thể:", bulkError);
                await Product.destroy({ where: { id: product.id } });
                throw new Error(`Lỗi tạo biến thể: ${bulkError.message}`);
            }

            const prices = data.variants.map(v => v.price).filter(p => p != null);
            if (prices.length > 0) {
                await product.update({
                    price_min: Math.min(...prices),
                    price_max: Math.max(...prices)
                });
            }
        }

        return {
            EC: 0,
            EM: "Tạo sản phẩm thành công",
            DT: {
                id: product.id,
                name: product.name,
            }
        };
    } catch (error) {
        console.error("Lỗi createProductService:", error);

        let errorMessage = "Lỗi tạo sản phẩm";
        if (error.message.includes('timeout') || error.http_code === 499) {
            errorMessage = "Lỗi timeout khi upload ảnh. Vui lòng thử lại với ảnh nhỏ hơn hoặc kiểm tra kết nối mạng.";
        } else if (error.name === 'SequelizeDatabaseError') {
            if (error.parent?.code === 'WARN_DATA_TRUNCATED') {
                errorMessage = "Lỗi dữ liệu: Giá trị sync_status không hợp lệ.";
            } else {
                errorMessage = `Lỗi database: ${error.parent?.sqlMessage || error.message}`;
            }
        } else if (error.message.includes('biến thể')) {
            errorMessage = error.message;
        }

        return {
            EC: 1,
            EM: errorMessage,
            DT: null
        };
    }
};

// Lấy tất cả sản phẩm kèm biến thể
export const getAllProducts = async () => {
    try {
        const products = await Product.findAll({
            include: [
                { model: ProductVariant, as: "variants" },
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


export const getProductById = async (id) => {
    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: ProductVariant, as: "variants" },
                { model: Category, as: "category" },
            ],
        });

        if (!product) {
            throw new Error('Không tìm thấy sản phẩm');
        }

        // Format data according to frontend needs
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            img: product.main_image || product.img,
            thumbnails: product.thumbnails || [],
            variants: product.variants || [],
            category: product.category,
            in_stock: product.in_stock,
            created_at: product.created_at,
            updated_at: product.updated_at
        };
    } catch (error) {
        console.error(" [getProductById] Service error:", error);
        throw error;
    }
};