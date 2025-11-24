import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendOrderEmailService = async (order) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Shop" <${process.env.EMAIL_USER}>`,
        to: order.email,
        subject: "Xác nhận đơn hàng",
        html: `
            <h2>Xin chào ${order.username},</h2>
            <p>Cảm ơn bạn đã đặt hàng!</p>
            <p><b>Tổng tiền:</b> ${order.total} VND</p>
            <hr/>
            <h3>Chi tiết đơn hàng:</h3>
            ${order.items
                .map(
                    (item) => `
                        <p>${item.name} - ${item.quantity} x ${item.price} VND</p>
                    `
                )
                .join("")}
        `,
    };

    return await transporter.sendMail(mailOptions);
};

export default sendOrderEmailService;
