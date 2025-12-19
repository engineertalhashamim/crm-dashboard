import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';
import { Pool } from 'pg';

dotenv.config({
  path: './.env',
});
console.log('Dialect:', process.env.DB_DIALECT);

const sequelize = new Sequelize(
  DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: console.log,
  }
);

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

export { connectDB, sequelize, pgPool };
