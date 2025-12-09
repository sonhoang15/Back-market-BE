import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_NODE =
    process.env.OPENSEARCH_NODE || "http://localhost:9200";

const clientConfig = {
    node: OPENSEARCH_NODE,
};

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
