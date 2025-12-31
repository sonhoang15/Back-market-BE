import express from "express";
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
import initApiRoutes from "./routes/api.js";
import initWebRoutes from "./routes/web.js";
import configcors from "./config/cors.js";
import cookieParser from 'cookie-parser';
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import { ensureProductIndex } from "./search/createProductIndex.js";
import { syncProductsToOpenSearch } from "./search/syncProducts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {

        await connectDB();

        await ensureProductIndex();
        await syncProductsToOpenSearch();

        configcors(app);
        app.use(express.json({ limit: "10mb" }));
        configViewEngine(app);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.get("/", (req, res) => {
            res.json({ status: "ok" });
        });

        initWebRoutes(app);
        initApiRoutes(app);

        app.use((req, res) => {
            return res.send("404 not found");
        });

        app.listen(PORT, "0.0.0.0", () => {
            console.log("Backend running on port " + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();