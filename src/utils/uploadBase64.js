import cloudinary from "../config/cloudinary.js";

export const uploadBase64Image = async (base64) => {
    try {
        const result = await cloudinary.uploader.upload(base64, {
            folder: "products", // Cloudinary folder name
            resource_type: "image",
        });
        return result.secure_url; // link ảnh
    } catch (err) {
        console.error("❌ Lỗi upload Cloudinary:", err);
        throw err;
    }
};
