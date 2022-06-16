import SQ, { where } from 'sequelize';
import { Op } from 'sequelize';
import { sequelize } from '../db/database.js';
import { Corporation } from './corporation.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

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

// FK 설정

Corporation.hasMany(Notice, {
    foreignKey: 'corp_id',
    onDelete: 'cascade',
});

Notice.belongsTo(Corporation, {
    foreignKey: 'corp_id',
    onDelete: 'cascade',
});

const INCLUDE_CORP = {
    attributes: [
        'notice_id',
        [Sequelize.col('corporation.corp_name'), 'corp_name'],
        [Sequelize.col('corporation.country'), 'country'],
        [Sequelize.col('corporation.region'), 'region'],
        'recruit_pos',
        'recruit_pay',
        'tech',
    ],
    include: {
        model: Corporation,
        attributes: [],
    },
};

export async function create(corp_id, recruit_pos, recruit_pay, recruit_content, tech) {
    return Notice.create({ corp_id, recruit_pos, recruit_pay, recruit_content, tech });
}

export async function getNoticeById(notice_id) {
    return Notice.findOne({
        where: { notice_id }
    });
}

export async function getCorpById(corp_id) {
    return Corporation.findOne({
        where: { id: corp_id }
    });
}

export async function getAll() {
    return Notice.findAll({ ...INCLUDE_CORP });
}

// export async function getAllBySearchName(search) {
//     // console.log(search);
//     return Notice.findAll({
//         ...INCLUDE_CORP,
//         where: {
//             [Op.or]: [
//                 { recruit_pos: `%${search}%` },
//                 { corp_name: `%${search}%` },
//             ]
//         }
//     });
// }

// export async function getAllBySearchPos(search) {
//     return Notice.findAll({
//         ...INCLUDE_CORP,
//         where: {
//             recruit_pos: {
//                 [Op.like]: `%${search}%`,
//             },
//         },
//     });
// }

export async function update(notice_id, modified) {
    return Notice.findByPk(notice_id, INCLUDE_CORP)
        .then((notice) => {
            Notice.update({ ...modified }, { where: { notice_id } })
            return notice.save();
        });
}


export async function remove(notice_id) {
    return Notice.findByPk(notice_id)
        .then(notice => {
            notice.destroy();
        });
}

// 데이터베이스 초기화 설정 
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