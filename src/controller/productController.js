import * as productService from "../service/productService.js";

const createProduct = async (req, res) => {
    try {
        // Truyền cả body + files sang service
        const result = await productService.createProductService(req.body, req.files);
        return res.status(200).json(result);
    } catch (error) {
        console.error(" Lỗi createProduct:", error);
        return res.status(500).json({ EC: 1, EM: "Lỗi server", DT: null });
    }
};

// Giữ nguyên các hàm khác
const getAllProducts = async (req, res) => {
    try {
        const result = await productService.getAllProducts();
        return res.status(200).json(result);
    } catch (error) {
        console.error("getAllProducts error:", error);
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const data = { ...req.body };
        if (req.file) {
            data.thumbnail = `data:image/${req.file.mimetype.split("/")[1]};base64,${req.file.buffer.toString("base64")}`;
        }
        const product = await productService.updateProduct(id, data);

        res.status(200).json({ EC: 0, EM: "Cập nhật thành công", DT: product });
    } catch (error) {
        res.status(500).json({ EC: 1, EM: error.message });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await productService.deleteProduct(id);

        return res.status(200).json({
            EC: 0,
            EM: "Delete product successfully",
            DT: data,
        });
    } catch (e) {
        console.error(" [deleteProduct] error:", e);
        return res.status(500).json({
            EC: 1,
            EM: e.message || "Error when deleting product",
            DT: [],
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                EC: 1,
                EM: "ID sản phẩm không hợp lệ",
                DT: null
            });
        }

        const product = await productService.getProductById(id);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                EC: 1,
                EM: "Không tìm thấy sản phẩm",
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Lấy thông tin sản phẩm thành công",
            DT: product
        });

    } catch (error) {
        console.error(" [getProductById] error:", error);
        return res.status(500).json({
            EC: 1,
            EM: error.message || "Lỗi server khi lấy thông tin sản phẩm",
            DT: null
        });
    }
};



export default { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById };
