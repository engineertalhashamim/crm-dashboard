import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";

export const Status = sequelize.define(
  "Status",
  {
    statusname: {
      type: DataTypes.STRING(75),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Status name is required" },
        len: { args: [2, 75], msg: "Status name must be 2 to 75 characters" },
      },
    },

    color: {
      type: DataTypes.STRING(7), // like #0069ff
      allowNull: true,
      validate: {
        len: {
          args: [0, 7],
          msg: "Color must be exactly 7 characters e.g. #0069ff",
        },
      },
    },
  },

  {
    timestamps: true,
    tableName: "status",
    hooks: {
      beforeValidate: (status) => {
        // console.log("🔥 beforeValidate triggered");
        // console.log("Incoming data44:", status.dataValues);
        for (const key in status.dataValues) {
          if (typeof status.dataValues[key] === "string") {
            // console.log(`Trimming field: ${key} →`, status.dataValues[key]);
            status.dataValues[key] = status.dataValues[key].trim();
          }
        }
        // console.log("After trimming:", status.dataValues);
      },
    },
  }
);
