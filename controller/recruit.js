import { Notice } from '../data/notice.js';
import { User } from '../data/user.js';
import { Corporation } from '../data/corporation.js';
import SQ from 'sequelize';
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
    res.status(201).json({
        notice,
        message: "Recruit Posting Success",
    });
}

export async function getDetailNotice(req, res) {
    const { notice_id } = req.params;
    const detail = await Notice.findOne({
        where: { notice_id }
    });

    // notice_id=1인 corp_id를 추출
    const { corp_id } = detail.dataValues;
    console.log(detail.dataValues);

    // 이후 Corporation에서 corp_id에 해당하는 corp_name추출해서 결과에 포함하기
    const corpInfo = await Corporation.findOne({
        where: { id: corp_id }
    });
    
    // 기업명이 나오니 기업id는 제외
    delete detail.dataValues.corp_id;
    delete corpInfo.dataValues.id;

    const result = detail.dataValues;
    
    res.status(200).json({
        ...result,
        ...corpInfo.dataValues
    });
}

export async function getAllNotices(req, res) {
    const result = await Notice.findAll({ ...INCLUDE_CORP });
    res.status(200).json({ result })
    
}

export async function modifyRecruitNotice(req, res) {
    const { notice_id } = req.params;
    const { recruit_pos, recruit_pay, recruit_content, tech } = req.body;
    const result = await Notice.findByPk(notice_id);
    console.log(result.dataValues);
    result.dataValues = {
        notice_id,
        recruit_pos,
        recruit_pay,
        recruit_content,
        tech
    };
    res.status(200).json({ result: result.dataValues });
}

export async function removeRecruitNotice(req, res) {
    const { notice_id } = req.params;
    const result = await Notice.findByPk(notice_id);
    // console.log(result.dataValues);
    result.destroy();
    res.status(204).json({ message: "Destroy Success" });
}