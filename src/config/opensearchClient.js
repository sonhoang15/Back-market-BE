import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_NODE = process.env.OPENSEARCH_NODE || "http://localhost:9200";
const OPENSEARCH_USER = process.env.OPENSEARCH_USER;
const OPENSEARCH_PASS = process.env.OPENSEARCH_PASS;

const clientConfig = {
    node: OPENSEARCH_NODE,
};

// If username and password are provided, add them to the config
if (OPENSEARCH_USER && OPENSEARCH_PASS) {
    clientConfig.auth = {
        username: OPENSEARCH_USER,
        password: OPENSEARCH_PASS,
    };
    // For cloud services that use HTTPS, this is often needed.
    // In a real production environment, you might want to handle certificates properly.
    clientConfig.ssl = {
        rejectUnauthorized: false,
    };
}

export const osClient = new Client(clientConfig);
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
