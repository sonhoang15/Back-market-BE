import { osClient } from "../config/opensearchClient.js";

async function deleteIndex() {
    try {
        const indexName = "products";
        const exists = await osClient.indices.exists({ index: indexName });

        if (!exists.body) {
            console.log("Index không tồn tại:", indexName);
            return;
        }

        const res = await osClient.indices.delete({ index: indexName });
        console.log("Đã xóa index:", indexName, res.body);
    } catch (err) {
        console.error("Lỗi khi xóa index:", err.meta?.body || err);
    }
}

deleteIndex();
