// src/config/opensearchClient.js
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_NODE = process.env.OPENSEARCH_NODE || "http://localhost:9200";

export const osClient = new Client({
    node: OPENSEARCH_NODE,
    // nếu cần auth: auth: { username: 'admin', password: 'admin' }
});

// helper: check connection
export const ping = async () => {
    try {
        const r = await osClient.ping();
        console.log("OpenSearch ping OK");
        return r;
    } catch (e) {
        console.error("OpenSearch ping failed:", e.message);
        throw e;
    }
};
