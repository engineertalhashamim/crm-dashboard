import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const Sources = sequelize.define(
  "Sources",
  {
    sourcename: {
      type: DataTypes.STRING(75),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Source name is required" },
        len: { args: [2, 75], msg: "Source name must be 2 to 75 characters" },
      },
    },
  },
  {
    timestamps: true,
    tableName: "sources",
    hooks: {
      beforeValidate: (instance) => {
        for (const key in instance.dataValues) {
          if (typeof instance.dataValues[key] === "string") {
            instance.dataValues[key] = instance.dataValues[key].trim();
          }
        }
      },
    },
  }
);
