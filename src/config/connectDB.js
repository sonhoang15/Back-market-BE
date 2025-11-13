import db from "../models/index.js";


const connectDB = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await db.sequelize.authenticate();


            if (process.env.NODE_ENV === 'development') {
                await db.sequelize.sync({ force: false });
            }
            return db;
        } catch (error) {
            if (i < retries - 1) {
                console.log(`Waiting ${delay / 1000} seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('All connection attempts failed');
                throw error;
            }
        }
    }
};

export default connectDB;