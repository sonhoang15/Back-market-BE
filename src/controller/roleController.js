import roleApiService from '../service/roleApiService.js'

const read = async (req, res) => {

    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await roleApiService.getAllRoleWithPagination(+page, +limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        } else {
            let data = await roleApiService.getAllRoles();
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            });
        }
    } catch (error) {
        console.error("Error fetching role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const create = async (req, res) => {
    try {
        let data = await roleApiService.createNewRoles(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error creating role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });

    }
}
const update = async (req, res) => {
    try {
        let data = await roleApiService.updateRole(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error creating role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });

    }
}
const deleteRoles = async (req, res) => {
    try {
        let data = await roleApiService.deleteRole(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error deleting role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const getRolesByGroup = async (req, res) => {
    try {
        let id = req.params.groupId
        let data = await roleApiService.getRolesByGroup(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error deleting role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const assignToGroup = async (req, res) => {
    try {
        let data = await roleApiService.assignToGroup(req.body.data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error deleting role:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}

module.exports = {
    read, create, update, deleteRoles, getRolesByGroup, assignToGroup
}
