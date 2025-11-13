import express from "express";
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
import initApiRoutes from "./routes/api.js";
import initWebRoutes from "./routes/web.js";
import configcors from "./config/cors.js";
import cookieParser from 'cookie-parser';
import connectDB from "./config/connectDB.js"; // ← CHỈ THAY ĐỔI Ở ĐÂY
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// KHỞI ĐỘNG ỨNG DỤNG - GIỮ NGUYÊN LOGIC
const startServer = async () => {
    try {
        // Kết nối database trước - GIỮ NGUYÊN
        await connectDB();

        // Sau khi database kết nối, khởi tạo server - GIỮ NGUYÊN
        configcors(app);
        app.use(express.json({ limit: "10mb" }));
        configViewEngine(app);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        initWebRoutes(app);
        initApiRoutes(app);

        app.use((req, res) => {
            return res.send("404 not found");
        });

        app.listen(PORT, () => {
            console.log("Backend running on port " + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();