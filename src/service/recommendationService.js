import axios from "axios";

export const recommendByText = async (text) => {
    const response = await axios.post(
        `${process.env.PYTHON_RECOMMEND_URL}/recommend`,
        { text, top_k: 8 }
    );

    return {
        EC: 0,
        EM: "OK",
        DT: response.data.DT || []
    };
};
