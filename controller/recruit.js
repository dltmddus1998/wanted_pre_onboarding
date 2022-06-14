import { Notice } from '../data/notice.js';
import { User } from '../data/user.js';
import { Corporation } from '../data/corporation.js';
import SQ from 'sequelize';
import { Op } from 'sequelize';
const Sequelize = SQ.Sequelize;

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

export async function registerRecruitNotice(req, res) {
    const { corp_id, recruit_pos, recruit_pay, recruit_content, tech } = req.body;

    const notice = await Notice.create({ corp_id, recruit_pos, recruit_pay, recruit_content, tech });

    return res.status(201).json({
        notice,
        message: "Recruit Posting Success",
    });
}

export async function getDetailNotice(req, res) {
    const { notice_id } = req.params;
    const detail = await Notice.findOne({
        where: { notice_id }
    });

    if (detail) {
        // notice_id=1인 corp_id를 추출
        const { corp_id } = detail.dataValues;

        // 이후 Corporation에서 corp_id에 해당하는 corp_name추출해서 결과에 포함하기
        const corpInfo = await Corporation.findOne({
            where: { id: corp_id }
        });
        
        // 기업명이 나오니 기업id는 제외
        delete detail.dataValues.corp_id;
        delete corpInfo.dataValues.id;

        const result = detail.dataValues;
        
        return res.status(200).json({
            ...result,
            ...corpInfo.dataValues
        });
    }
    return res.status(404).json({ message: `Notice Id(${notice_id}) is not found!!` });
}

export async function getAllNotices(req, res) {
    const { search } = req.query;
    
    // 모든 채용공고 조회
    if (!search) {
        const result = await Notice.findAll({ ...INCLUDE_CORP });
        return res.status(200).json({ result });
    }
    // 부분검색으로 조회
    // result1 => 회사이름 부분 검색
    const result1 = await Notice.findAll({
        ...INCLUDE_CORP,
        include: {
            ...INCLUDE_CORP.include,
            where: {
                corp_name: {
                    [Op.like]: `%${search}%`,
                },
            },
        },
    });

    // result2 => 채용포지션 부분 검색
    const result2 = await Notice.findAll({
        ...INCLUDE_CORP,
        where: {
            recruit_pos: {
                [Op.like]: `%${search}%`
            },
        },
    });

    return res.status(200).json({ result1, result2 }); 
}

export async function modifyRecruitNotice(req, res) {
    const { notice_id } = req.params;
    const { recruit_pos, recruit_pay, recruit_content, tech } = req.body;

    const data = {
        notice_id,
        recruit_pos,
        recruit_pay,
        recruit_content,
        tech,
    };
    await Notice.update({...data}, { where: { notice_id } });
    const modified = await Notice.findOne({
        where: {
            notice_id
        },
    });
    if (!modified) {
        return res.status(404).json({ message: "Notice is not found!!" });
    }

    return res.status(200).json({
        data: modified.dataValues,
    })
}

export async function removeRecruitNotice(req, res) {
    const { notice_id } = req.params;
    const result = await Notice.findByPk(notice_id);

    if (!result) {
        return res.status(404).json({ message: "Notice is not found!" });
    }
    
    result.destroy({ where: notice_id });
    return res.status(204).json({ message: "Destroy Success" });
}