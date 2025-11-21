import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "back-market",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_TEST || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    timezone: "+07:00",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA
      }
    }
  },
};

export default config;