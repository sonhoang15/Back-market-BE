import db from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";

const { ProductVariant, Product } = db;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractCloudinaryPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts.pop();
    const folder = parts.pop();
    return `${folder}/${filename.split('.')[0]}`;
};

export const createVariant = async (data) => {
    try {
        const {
            product_id,
            size,
            color,
            price,
            stock,
            quantity,
            image,
            images,
            _files,
        } = data;

        if (!product_id) return { EC: 1, EM: "Thiếu product_id", DT: null };

        const product = await Product.findByPk(product_id);
        if (!product) return { EC: 1, EM: "Sản phẩm không tồn tại", DT: null };

        const finalStock = stock ?? quantity ?? 0;

        let imageUrl = null;

        if (image && typeof image === "string" && image.startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(image, { folder: "product_variants" });
            imageUrl = uploadRes.secure_url;
        }
        else if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string" && images[0].startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(images[0], { folder: "product_variants" });
            imageUrl = uploadRes.secure_url;
        }
        else if (_files && _files.length > 0) {
            const f = _files[0];
            if (f.path) {
                const uploadRes = await cloudinary.uploader.upload(f.path, { folder: "product_variants" });
                imageUrl = uploadRes.secure_url;
            } else if (f.buffer) {
                const streamUpload = (buffer) => new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ folder: "product_variants" }, (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
                    stream.end(buffer);
                });
                const uploadRes = await streamUpload(f.buffer);
                imageUrl = uploadRes.secure_url;
            }
        }

        const name = `${color || ""}${size ? " - " + size : ""}`.trim();

        const variant = await ProductVariant.create({
            product_id,
            name,
            color: color ?? null,
            size: size ?? null,
            price: price ? Number(price) : 0,
            stock: Number(finalStock),
            image: imageUrl,
            source_type: data.source_type ?? "manual",
            sync_status: "manual_edited",
        });

        return { EC: 0, EM: "Tạo biến thể thành công", DT: variant };
    } catch (error) {
        console.error(" [createVariant] Lỗi:", error);
        let errorMessage = error.message || "Lỗi khi tạo biến thể";
        if (error.name === 'SequelizeDatabaseError') {
            if (error.parent?.code === 'WARN_DATA_TRUNCATED' && error.parent?.sqlMessage?.includes('sync_status')) {
                errorMessage = "Lỗi dữ liệu: Giá trị sync_status không hợp lệ. Chỉ cho phép: 'synced', 'manual_edited'";
            }
        }

        return { EC: 1, EM: errorMessage, DT: null };
    }
};

export const getVariantsByProduct = async (product_id) => {
    return await ProductVariant.findAll({
        where: { product_id },
        order: [["id", "ASC"]],
    });
};

export const updateVariant = async (data, file) => {
    try {
        const variant = await ProductVariant.findByPk(data.id);
        if (!variant) throw new Error("Variant not found");

        let imageUrl = variant.image;

        if (file && file.buffer) {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

            const uploadRes = await cloudinary.uploader.upload(base64Image, {
                folder: "product_variants",
            });

            imageUrl = uploadRes.secure_url;
        }

        else if (data.image && data.image.startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(data.image, {
                folder: "product_variants",
            });
            imageUrl = uploadRes.secure_url;
        }

        const name =
            data.name ??
            `${data.color || variant.color || ""}${data.size ? " - " + data.size : variant.size ? " - " + variant.size : ""
                }`.trim();

        await variant.update({
            name,
            price: data.price ?? variant.price,
            color: data.color ?? variant.color,
            size: data.size ?? variant.size,
            stock: data.stock ?? variant.stock,
            image: imageUrl,
        });
        await variant.reload();
        return variant;
    } catch (error) {
        console.error("[updateVariant] Lỗi:", error);
        throw error;
    }
};

export const deleteVariant = async (id) => {
    try {
        if (!id) return { EC: 1, EM: "Missing variant id" };

        const variant = await ProductVariant.findByPk(id);
        if (!variant) {
            return { EC: 1, EM: "Không tìm thấy biến thể", DT: null };
        }

        if (variant.image) {
            try {
                const publicId = extractCloudinaryPublicId(variant.image);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { invalidate: true });
                }
            } catch (err) {
                console.warn("[deleteVariant] Cloudinary destroy failed:", err?.message || err);
            }
        }

        await variant.destroy();
        return { EC: 0, EM: "Xóa thành công", DT: null };
    } catch (error) {
        console.error(" [deleteVariant] Lỗi:", error);
        return { EC: 1, EM: "Lỗi khi xóa biến thể", DT: null };
    }
};