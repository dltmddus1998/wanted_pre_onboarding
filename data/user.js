import SQ from 'sequelize';
import { sequelize } from '../db/database.js'; 
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
    'user',
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
    },
    { timestamps: false }
);