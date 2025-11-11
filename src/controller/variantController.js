import * as variantService from "../service/variantService.js";

const createVariant = async (req, res) => {
    try {
        // gom body + files lại
        const payload = { ...req.body };
        if (req.files && req.files.length > 0) {
            // truyền file lên service để xử lý (tùy cách bạn dùng multer: file.path hoặc buffer)
            payload._files = req.files;
        }
        const result = await variantService.createVariant(payload);
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Lỗi createVariant:", error);
        return res.status(500).json({ EC: 1, EM: error.message || "Lỗi khi tạo biến thể", DT: null });
    }
};


const getVariantsByProduct = async (req, res) => {
    try {
        const data = await variantService.getVariantsByProduct(req.params.product_id);
        return res.status(200).json({ EC: 0, EM: "Success", DT: data });
    } catch (error) {
        console.error("getVariantsByProduct error:", error);
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

const updateVariant = async (req, res) => {
    try {
        // ✅ Truyền cả req.body và req.file (do multer memoryStorage)
        const file = req.files?.[0] || null; // ✅ lấy file từ multer (upload.any())
        const data = await variantService.updateVariant(req.body, file);
        return res.status(200).json({ EC: 0, EM: "Variant updated", DT: data });
    } catch (error) {
        console.error("updateVariant error:", error);
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

const deleteVariant = async (req, res) => {
    try {
        const id = req.params.id; // lấy từ params theo RESTful
        if (!id) {
            return res.status(400).json({ EC: 1, EM: "Missing variant id", DT: null });
        }

        const result = await variantService.deleteVariant(id);

        if (result?.EC === 0) {
            return res.status(200).json(result);
        } else {
            // trả lỗi 404 nếu không tìm thấy, else 400/500
            const status = result?.EM?.toLowerCase().includes("không tìm") ? 404 : 400;
            return res.status(status).json(result);
        }
    } catch (error) {
        console.error("deleteVariant error:", error);
        return res.status(500).json({ EC: 1, EM: error.message || "Lỗi server", DT: null });
    }
};
export default { createVariant, getVariantsByProduct, updateVariant, deleteVariant };
