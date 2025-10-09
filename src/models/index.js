import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// ✅ Cách đọc config JSON an toàn trên Windows
const configPath = path.join(__dirname, "../config/config.json");
const rawConfig = fs.readFileSync(configPath, "utf-8");
const config = JSON.parse(rawConfig)[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.endsWith(".js"));

for (const file of files) {
  // ✅ Luôn dùng file:// URL khi import động trong ESM
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const modelModule = await import(modelPath);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
