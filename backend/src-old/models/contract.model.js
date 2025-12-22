import { sequelize } from '../db/index.js';
import { DataTypes } from 'sequelize';
import { Client } from './client.model.js';

export const Contract = sequelize.define('Contract', {
    parentCustomerId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      references: {
         model: "clients",
         key: "id"
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },

    subject: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
           msg : 'Subject is required'
        }
      }
    },

    contractValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
      validate: {
        isNumeric: {msg : 'Contract value must be numeric'}
      }
    },

    contractType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g. Maintenance, Supply, Service Agreement',
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'Start Date must be a valid date' }
      }
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'End Date must be a valid date' }
      }
    },

    status: {
      type: DataTypes.ENUM('draft', 'active', 'expired', 'terminated'),
      allowNull: true,
      defaultValue: 'active'
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
   
  },
  {
    timestamps: true,
    tableName: 'contracts',
    hooks: {
      beforeValidate: (contract) => {
        for (const key in contract.dataValues) {
          if (typeof contract.dataValues[key] === 'string') {
            contract.dataValues[key] = contract.dataValues[key].trim();
          }
        }
      },
    },
  }
);


Contract.belongsTo(Client, {
  foreignKey: "parentCustomerId",
  as: "parentCustomer"
});
