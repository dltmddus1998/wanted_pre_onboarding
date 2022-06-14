import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { Corporation } from './corporation.js';
const DataTypes = SQ.DataTypes;

export const Notice = sequelize.define(
    'notice',
    {
        notice_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        recruit_pos: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        recruit_pay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recruit_content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        tech: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    { timestamps: false },  
);

Corporation.hasMany(Notice, {
    foreignKey: 'corp_id',
    onDelete: 'cascade',
});

Notice.belongsTo(Corporation, {
    foreignKey: 'corp_id',
    onDelete: 'cascade',
});

Notice.sync()
    .then(() => {
        Notice.findAndCountAll({
            where: {}
        }).then(fields => {
            if (fields.count > 0) {
                Notice.destroy({
                    where: {},
                });
            }
        });
    });