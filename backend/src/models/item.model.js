import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

import { itemTaxOptions, itemGroupOptions } from "../constants/itemOptions.js";

export const Item = sequelize.define(
  "Item",
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        notEmpty: true,
      },
    },

    tax_1: {
      type: DataTypes.ENUM(...itemTaxOptions),
      allowNull: true,
      defaultValue: "No Tax",
    },

    tax_2: {
      type: DataTypes.ENUM(...itemTaxOptions),
      allowNull: true,
      defaultValue: "No Tax",
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    item_group: {
      type: DataTypes.ENUM(...itemGroupOptions),
      allowNull: true,
      defaultValue: null,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "items",
    indexes: [{ fields: ["description"] }, { fields: ["item_group"] }],
    timestamps: true,
    hooks: {
      beforeValidate: (instance) => {
        for (const key in instance.dataValues) {
          if (typeof instance.dataValues[key] === "string") {
            instance.dataValues[key] = instance.dataValues[key].trim();
          }
        }
      },
    },
  },
);
