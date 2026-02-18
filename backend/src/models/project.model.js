import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Client } from "./client.model.js";

import {
  billingTypeOptions,
  statusOptions,
} from "../constants/projectOptions.js";

export const Project = sequelize.define(
  "Project",
  {
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    billing_type: {
      type: DataTypes.ENUM(...billingTypeOptions),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...statusOptions),
      allowNull: false,
      defaultValue: "Not Started",
    },
    total_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rate_per_hour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estimated_hours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    // members: {
    //   type: DataTypes.ARRAY(DataTypes.INTEGER),
    //   allowNull: true,
    //   defaultValue: [],
    //   validate: {
    //     isValid(value) {
    //       if (!value) return;
    //       if (!Array.isArray(value))
    //         throw new Error("Members must be an array");
    //       if (value.some((id) => id <= 0))
    //         throw new Error("IDs must be positive");
    //     },
    //   },
    // },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "projects",
    timestamps: true,
    indexes: [
      {
        fields: ["customer_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["project_name"],
      },
    ],
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

Project.belongsTo(Client, {
  foreignKey: "customer_id",
  as: "customer",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
