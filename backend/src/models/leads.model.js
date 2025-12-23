import { DataTypes } from "sequelize";
import { Status } from "./status.model.js";
import { Sources } from "./source.model.js";
import { User } from "./user.model.js";
import { sequelize } from "../db/index.js";

export const Leads = sequelize.define(
  "Leads",
  {
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "status",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sources",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    assigned_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    name_lead: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters",
        },
      },
    },

    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone1: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        len: {
          args: [11, 11],
          msg: "Phone Number must be 11 digits",
        },
        isNumeric: {
          msg: "Phone Number must contain only digits",
        },
      },
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leadValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: "Lead value must be at least 0",
        },
        max: {
          args: 9999999999999999.99, // max 18 digits total, 2 decimals
          msg: "Lead value must be at most 18 digits",
        },
        isDecimal: {
          msg: "Lead value must be a decimal number",
        },
      },
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    defaultLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "System Default",
    },
    // contactedDate: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
  },
  {
    timestamps: true,
    tableName: "leads",
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

Leads.belongsTo(Status, {
  foreignKey: "status_id",
  as: "statusId",
});

Leads.belongsTo(Sources, {
  foreignKey: "source_id",
  as: "sourceId",
});

Leads.belongsTo(User, {
  foreignKey: "assigned_user_id",
  as: "assignedUserId",
});
