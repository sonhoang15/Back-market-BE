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
module.exports = {
    getGroup
}