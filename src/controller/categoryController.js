// src/controller/categoryController.js
import categoryService from "../service/categoryService.js";

// GET /api/v1/category/read
const read = async (req, res) => {
    try {
        let data = await categoryService.getCategory();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT || []
        });
    } catch (error) {
        console.error("Error getting categories:", error);
        return res.status(500).json({
            EM: "Server Error",
            EC: -1,
            DT: []
        });
    }
};

// POST /api/v1/category/create
const create = async (req, res) => {
    try {
        let data = await categoryService.createNewCategory(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT || {}
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({
            EM: "Server Error",
            EC: -1,
            DT: {}
        });
    }
};

// PUT /api/v1/category/update
const update = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        const result = await categoryService.updateCategory({ id, name });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in updateCategory:", error);
        return res.status(500).json({
            EM: "Internal server error",
            EC: -1,
            DT: {},
        });
    }
};

const deleteCategories = async (req, res) => {
    try {
        const id = req.params.id; // lấy id từ URL
        const result = await categoryService.deleteCategory(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in handleDeleteCategory:", error);
        return res.status(500).json({
            EM: "Internal server error",
            EC: -1,
            DT: {},
        });
    }
};

export default {
    read,
    create,
    update,
    deleteCategories
};
