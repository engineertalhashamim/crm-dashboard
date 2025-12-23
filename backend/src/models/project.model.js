import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const Projects = sequelize.define(
  "Projects",
  {
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Project name is required" },
        len: { args: [2, 100], msg: "Project name must be 2–100 characters" },
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    billing_type: {
      type: DataTypes.ENUM("Task Hours", "Fixed Rate", "Project Hours"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Not Started",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled"
      ),
      allowNull: true,
      defaultValue: "Not Started",
    },
    estimated_hours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    calculate_progress: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
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
    send_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "projects",
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
  }
);

Projects.belongsTo(Client, {
  foreignKey: "customer_id",
  as: "customerId",
});