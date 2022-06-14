import SQ from 'sequelize';
import Sequelize from 'sequelize';
import { sequelize } from '../db/database.js'; 
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
    'user',
    {
        user_id: {
            type: DataTypes.UUID,
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
    { timestamps: false, freezeTableName: true },
);

// 임의의 사용자 데이터 삽입    
const users = [
    {
        user_id: "user1",
        user_name: "이승연",
        email: "abc@123.com",
    },
    {
        user_id: "user2",
        user_name: "김한별",
        email: "def@456.com",
    },
    {
        user_id: "user3",
        user_name: "최진주",
        email: "ghi@789.com",
    },
    {
        user_id: "user4",
        user_name: "박세은",
        email: "jkl@123.com",
    },
    {
        user_id: "user5",
        user_name: "김민희",
        email: "mno@456.com",
    },
];

User.sync()
    .then(() => {
        User.findAndCountAll({
            where: {}
        }).then(fields => {
            if (fields.count > 0) {
                User.destroy({
                    where: {},
                });
            }
        }).then(() => {
            users.forEach(user => {
                User 
                    .build(user)
                    .save()
            });  
        });
    })