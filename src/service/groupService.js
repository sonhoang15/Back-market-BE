import db from "../models"

const getGroup = async () => {
    try {
        let data = await db.Group.findAll();
        return {
            EM: "ok fetching group",
            EC: 0,
            DT: data || {}
        };
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            EM: "Error deleting user",
            EC: -1,
            DT: {}
        };
    }
}
const createNewGroup = async (data) => {
    try {
        if (!data || !data.name) {
            return {
                EM: "Missing required parameters",
                EC: 1,
                DT: null
            };
        }

        // kiểm tra group name đã tồn tại chưa
        let existing = await db.Group.findOne({
            where: { name: data.name }
        });

        if (existing) {
            return {
                EM: "Group name already exists",
                EC: 2,
                DT: null
            };
        }

        // tạo group mới
        let newGroup = await db.Group.create({
            name: data.name,
            description: data.description || ""
        });

        return {
            EM: "Group created successfully",
            EC: 0,
            DT: newGroup
        };
    } catch (error) {
        console.log(">>> createNewGroup error: ", error);
        return {
            EM: "Something went wrong on server",
            EC: -1,
            DT: null
        };
    }
};
const deleteGroup = async (id) => {
    try {
        let data = await db.Group.findOne({
            where: { id: id }
        })
        await data.destroy();
        return {
            EM: `Delete group succeeds`,
            EC: 0,
            DT: {}
        };
    } catch (error) {
        console.error("Error deleting group:", error);
        return {
            EM: "Error Delete group",
            EC: -1,
            DT: {}
        };

    }
};
module.exports = {
    getGroup,
    createNewGroup,
    deleteGroup
}