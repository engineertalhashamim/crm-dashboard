import { sequelize } from '../db/index.js';
import { DataTypes } from 'sequelize';

export const Contact = sequelize.define(
  'Contact',
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
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
    direction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [7, 20],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'contacts',
    hooks: {
      beforeValidate: (contact) => {
        for (const key in contact.dataValues) {
          if (typeof contact.dataValues[key] === 'string') {
            contact.dataValues[key] = contact.dataValues[key].trim();
          }
        }
      },
    },
  }
);
