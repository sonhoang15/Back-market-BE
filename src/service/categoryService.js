import db from "../models/index.js";

const getCategory = async () => {
    try {
        let categories = await db.Category.findAll({
            attributes: ["id", "name"],
            order: [["id", "DESC"]],
        });

        return {
            EM: "Get categories successfully",
            EC: 0,
            DT: categories,
        };
    } catch (error) {
        console.error("Error in getCategories:", error);
        return {
            EM: "Something went wrong",
            EC: 1,
            DT: [],
        };
    }
};

const createNewCategory = async (data) => {
    try {
        if (!data.name || data.name.trim() === "") {
            return {
                EM: "Name is required",
                EC: 1,
                DT: {},
            };
        }

        // Check duplicate
        let exist = await db.Category.findOne({ where: { name: data.name } });
        if (exist) {
            return {
                EM: "Category already exists",
                EC: 1,
                DT: {},
            };
        }

        let newCategory = await db.Category.create({ name: data.name });
        return {
            EM: "Create category successfully",
            EC: 0,
            DT: newCategory,
        };
    } catch (error) {
        console.error("Error in createNewCategory:", error);
        return {
            EM: "Something went wrong",
            EC: 1,
            DT: {},
        };
    }
};

const deleteCategory = async (id) => {
    try {
        if (!id) {
            return {
                EM: "Category ID is required",
                EC: 1,
                DT: {},
            };
        }

        let category = await db.Category.findOne({ where: { id } });
        if (!category) {
            return {
                EM: "Category not found",
                EC: 1,
                DT: {},
            };
        }

        await db.Category.destroy({ where: { id } });

        return {
            EM: "Delete category successfully",
            EC: 0,
            DT: { id },
        };
    } catch (error) {
        console.error("Error in deleteCategories:", error);
        return {
            EM: "Something went wrong",
            EC: 1,
            DT: {},
        };
    }
};

const updateCategory = async ({ id, name }) => {
    try {
        if (!id || !name) {
            return {
                EM: "Missing required parameters",
                EC: 1,
                DT: {},
            };
        }

        let category = await db.Category.findOne({ where: { id } });
        if (!category) {
            return {
                EM: "Category not found",
                EC: 1,
                DT: {},
            };
        }

        category.name = name;
        await category.save();

        return {
            EM: "Update category successfully",
            EC: 0,
            DT: category,
        };
    } catch (error) {
        console.error("Error in updateCategory:", error);
        return {
            EM: "Something went wrong",
            EC: 1,
            DT: {},
        };
    }
};
export default {
    getCategory,
    createNewCategory,
    deleteCategory,
    updateCategory,
};
