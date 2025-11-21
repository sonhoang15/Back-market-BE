import sendOrderEmailService from "../service/emailService.js";

const sendOrderEmail = async (req, res) => {
    try {
        const result = await sendOrderEmailService(req.body);
        return res.status(200).json({
            EC: 0,
            EM: "Email gửi thành công!",
            DT: result
        });
    } catch (error) {
        return res.status(500).json({
            EC: -1,
            EM: "Gửi email thất bại!",
        });
    }
};

export default {
    sendOrderEmail,
};
