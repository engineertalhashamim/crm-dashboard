import { sequelize } from "../db/index.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
export const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: { args: [2, 100], msg: "Name must be 2 to 100 characters" },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "username is required" },
        len: { args: [2, 75], msg: "User Name must be 2 to 75 characters" },
      },
      set(value) {
        this.setDataValue("username", value.toLowerCase());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Invalid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "password is required" },
        len: { args: [5, 75], msg: "password must be 5 to 75 characters" },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    hooks: {
      beforeValidate: (instance) => {
        for (const key in instance.dataValues) {
          if (typeof instance.dataValues[key] === "string") {
            instance.dataValues[key] = instance.dataValues[key].trim();
          }
        }
      },
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);
1;
// Custom method to check password
User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
