import { connectDB, sequelize } from './db/index.js';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(async () => {
    // Sync all models with database
    try {
      await sequelize.sync({ alter: true });
      console.log('PostgreSQL connected successfully!');
    } catch (err) {
      console.log('Error syncing database tables:', err);
    }
    app.listen(process.env.PORT || 3000, () => {
      console.log(`R | server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('Server connection failed !!!', err);
  });
