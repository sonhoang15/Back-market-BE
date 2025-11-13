import db from "../src/models/index.js";
import { crawlList } from "./crawlList.js";
import { crawlDetailAll } from "./crawlDetail.js";

const { sequelize } = db;

(async () => {
    try {
        await sequelize.authenticate();
        console.log(" Kết nối database thành công");

        await crawlList();
        await crawlDetailAll();

    } catch (err) {
        console.error(" Lỗi:", err);
    } finally {
        await sequelize.close();
        console.log(" Đóng kết nối database thành công");
    }
})();