const groupServiceModule = await import('../service/groupService.js');
const groupService = groupServiceModule.default;

const read = async (req, res) => {
    try {
        let data = await groupService.getGroup();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT || {}
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const create = async (req, res) => {
    try {
        let data = await groupService.createNewGroup(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT || {}
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const deleteGroup = async (req, res) => {
    try {
        let data = await groupService.deleteGroup(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error deleting group:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
};

export default {
    read,
    create,
    deleteGroup
}