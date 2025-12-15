import { DataTypes } from "sequelize";
import { sequelize } from "../db.index.js";

export const Leads = sequelize.define(
  "Leads",
  {
    parentStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "status",
        key: "id"
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE"
    },
    // {
    //   parentSourceId: {
    //     allowNull: false,
    //     references: {
    //       model: "sources",
    //       key: "id"
    //     },
    //     onDelete: "RESTRICT",
    //     onUpdate: "CASCADE"
    //   }
    // }
  },
  {
    timestamps: true,
    tableName: "leads",
    Hooks: {
      beforeValidate: (instant) => {
        for (const key in instant.dataValues) {
          if (typeof instant.dataValues[key] === "string") {
            instant.dataValues = instant.dataValues[key].trim();
          }
        }
      },
    },
  }
);
