import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Status } from "./status.model.js";
import { Sources } from "./source.model.js";
import { User } from "./user.model.js";

export const Leads = sequelize.define(
  "Leads",
  {
    parent_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "status",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    parent_source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sources",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    parent_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    // tags: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    //   allowNull: true,
    // },
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: true,
    //     len: [2, 100],
    //   },
    // },
    // position: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   validate: {
    //     isEmail: true,
    //   },
    // },
    // website: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // phone: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // leadValue: {
    //   type: DataTypes.DECIMAL(12, 2),
    //   allowNull: true,
    // },
    // company: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    // address: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // city: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // state: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // country: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // zipCode: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // defaultLanguage: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    //   defaultValue: "System Default",
    // },
    // isPublic: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
    // contactedToday: {
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
  foreignKey: "parent_status_id",
  as: "parentStatus",
});

Leads.belongsTo(Sources, {
  foreignKey: "parent_source_id",
  as: "parentSource",
});

Leads.belongsTo(User, {
  foreignKey: "parent_user_id",
  as: "parentUser",
});
