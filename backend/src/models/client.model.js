import { DataTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

export const Client = sequelize.define(
  'Client',
  {
    companyname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vatnumber: {
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
      validate: {
        isUrl: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assigned: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'clients',
    hooks: {
      beforeValidate: (client) => {
        for (const key in client.dataValues) {
          if (typeof client.dataValues[key] === 'string') {
            client.dataValues[key] = client.dataValues[key].trim();
          }
        }
      },
    },
  }
);
