import express from 'express';

const router = express.Router();

export default function recruitRouter(recruitController) {
    router.post('/', recruitController.registerRecruitNotice);

    router.patch('/:notice_id', recruitController.modifyRecruitNotice);

    router.delete('/:notice_id', recruitController.removeRecruitNotice);

    router.get('/:notice_id', recruitController.getDetailNotice);

    router.get('/', recruitController.getAllNotices);
    return router;
}