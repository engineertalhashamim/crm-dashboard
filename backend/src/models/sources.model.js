import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Sources = sequelize.define(
  "Sources",
  {
    statusname: {
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
      beforeValidate: (sources) => {
        for (const key in sources.dataValues) {
          if (typeof sources.dataValues[key] === "string") {
            sources.dataValues[key] = sources.dataValues[key].trim();
          }
        }
      },
    },
  }
);
