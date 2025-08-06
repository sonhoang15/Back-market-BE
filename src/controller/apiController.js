import crudService from "../service/crudService";

const handleRegister = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.phone) {
            return res.status(200).json({
                EM: "Missing required parameters",
                EC: 1,
                DT: {}

            });
        }
        if (req.body.password && req.body.password.length < 6) {
            return res.status(200).json({
                EM: "Password must be at least 6 characters",
                EC: 1,
                DT: {}
            });
        }
        let data = await crudService.registerNewUser(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT || {}
        });
    } catch (error) {
        console.error("Error in handleRegister:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}

const handleLogin = async (req, res) => {
    try {
        let data = await crudService.handleUserLogin(req.body);
        if (data && data.DT && data.DT.access_token) {
            res.cookie("jwt", data.DT.access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            })
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        console.error("Error in handleLogin:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
const handleLogout = (req, res) => {
    try {
        res.clearCookie("jwt")
        return res.status(200).json({
            EM: "Delete oke",
            EC: 0,
            DT: ""
        });
    } catch (error) {
        console.error("Error in handleLogin:", error);
        return res.status(500).json({
            EM: "err Server Error",
            EC: -1,
            DT: {}
        });
    }
}
module.exports = {
    handleRegister, handleLogin, handleLogout
}
