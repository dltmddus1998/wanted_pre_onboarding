import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const Corporation = sequelize.define(
    'corporation',
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        corp_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    { timestamps: false, freezeTableName: true },
);

// 임의의 기업 데이터 삽입
const corporations = [
    {
        id: "ALS14",
        corp_name: "원티드랩",
        country: "대한민국",
        region: "서울"
    },
    {
        id: "LL124",
        corp_name: "네이버",
        country: "대한민국",
        region: "판교"
    },
    {
        id: "CC000",
        corp_name: "카카오",
        country: "대한민국",
        region: "제주"
    },
    {
        id: "LNW97",
        corp_name: "당근마켓",
        country: "대한민국",
        region: "서울"
    },
    {
        id: "AA111",
        corp_name: "야놀자",
        country: "대한민국",
        region: "서울"
    },
];

Corporation.sync()
    .then(() => {
        Corporation.findAndCountAll({
            where: {}
        }).then(fields => {
            if (fields.count > 0) {
                Corporation.destroy({
                    where: {}
                });
            }
        }).then(() => {
            corporations.forEach(corporation => {
                Corporation
                    .build(corporation)
                    .save();
            });
        });
    });