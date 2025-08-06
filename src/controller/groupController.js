import groupService from '../service/groupService.js';

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
module.exports = {
    read
}