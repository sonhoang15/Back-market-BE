// db.js
import { Sequelize } from "sequelize";

const db = new Sequelize("back-market", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

export default db; // default export
