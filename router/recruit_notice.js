import express from 'express';
import * as recruitController from '../controller/recruit.js';

const router = express.Router();

router.post('/', recruitController.registerRecruitNotice);

router.patch('/:notice_id', recruitController.modifyRecruitNotice);

router.delete('/:notice_id', recruitController.removeRecruitNotice);

router.get('/:notice_id', recruitController.getDetailNotice);

router.get('/', recruitController.getAllNotices);

export default router;