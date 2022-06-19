export class RecruitController {
    constructor(noticeRepository) {
        this.notices = noticeRepository;
    }
    
    registerRecruitNotice = async (req, res) => {
        const { corp_id, recruit_pos, recruit_pay, recruit_content, tech } = req.body;

        if(!corp_id) {
            return res.status(403).json({ message: "Cannot post recruit notice!" });
        }
    
        const notice = await this.notices.create(corp_id, recruit_pos, recruit_pay, recruit_content, tech);

    
        return res.status(201).json({
            notice,
            message: "Recruit Posting Success",
        });
    }

    getDetailNotice = async (req, res) => {
        const { notice_id } = req.params;
        const detail = await this.notices.getNoticeById(notice_id);
    
        if (detail) {
            // notice_id=1인 corp_id를 추출
            const { corp_id } = detail.dataValues;
    
            // 이후 Corporation에서 corp_id에 해당하는 corp_name추출해서 결과에 포함하기
            const corpInfo = await this.notices.getCorpById(corp_id);
            
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

    getAllNotices = async (req, res) => {
        const { search } = req.query;
        // console.log(search);
        const data = await(search
            // ? this.notices.getAllBySearchName(search)
            ? null
            : this.notices.getAll());
    
        return res.status(200).json(data); 
    }

    modifyRecruitNotice = async (req, res) => {
        const { notice_id } = req.params;
        const { recruit_pos, recruit_pay, recruit_content, tech } = req.body;

        const result = await this.notices.getNoticeById(notice_id);
    
        if (!result) {
            return res.status(404).json({ message: "Notice is not found!" });
        }
        const modified = {
            notice_id,
            recruit_pos,
            recruit_pay,
            recruit_content,
            tech,
        }
    
        const data = await this.notices.update(notice_id, modified);
        return res.status(200).json(data);
    }

    removeRecruitNotice = async (req, res) => {
        const { notice_id } = req.params;
        const result = await this.notices.getNoticeById(notice_id);
    
        if (!result) {
            return res.status(404).json({ message: "Notice is not found!" });
        }
        
        await this.notices.remove(notice_id);
        res.status(204).json({ message: "Destroy Success" });
    }
}