import { sequelize } from "./db/index.js";
import { Leads } from "./models/leads.model.js";
import { User } from "./models/user.model.js";
import { Status } from "./models/status.model.js";
import { Sources } from "./models/source.model.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected!");

    // Ye line sab tables ko create/update karegi agar abhi tak nahi bane
    await sequelize.sync({ alter: true }); 
    console.log("✅ Tables synced successfully!");

    process.exit(); // file run hone ke baad exit ho jaye
  } catch (err) {
    console.error("❌ Error syncing tables:", err);
    process.exit(1);
  }
})();