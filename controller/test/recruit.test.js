import faker from 'faker';
import { RecruitController } from '../recruit.js';
import httpMocks from 'node-mocks-http';

describe('RecruitController', () => {
    let recruitController;
    let noticeRepository;
    let corpRepository;

    beforeEach(() => {
        noticeRepository = {};
        corpRepository = {};
        recruitController = new RecruitController(
            noticeRepository,
            corpRepository,
        );
    });

    describe('registerRecruitNotice', () => {
        let newCorpId, newRecruitPos, newRecruitPay, newRecruitContent, newTech, request, response;
        beforeEach(() => {
            newCorpId = faker.random.alphaNumeric(5);
            newRecruitPos = faker.random.words(3);
            newRecruitPay = faker.random.number(7);
            newRecruitContent = faker.random.words(29);
            newTech = faker.random.words(5);
            request = httpMocks.createRequest({
                body: {
                    corp_id: newCorpId,
                    recruit_pos: newRecruitPos,
                    recruit_pay: newRecruitPay,
                    recruit_content: newRecruitContent,
                    tech: newTech,
                }
            });
            response = httpMocks.createResponse();
        });

        it('register a new recruit notice', async () => {
            noticeRepository.create = jest.fn((corp_id, recruit_pos, recruit_pay, recruit_content, tech) => {
                return {
                    corp_id,
                    recruit_pos,
                    recruit_pay,
                    recruit_content,
                    tech,
                };
            });

            await recruitController.registerRecruitNotice(request, response);

            expect(response.statusCode).toBe(201);
            expect(response._getJSONData()).toMatchObject({
                notice: {
                    corp_id: newCorpId,
                    recruit_pos: newRecruitPos,
                    recruit_pay: newRecruitPay,
                    recruit_content: newRecruitContent,
                    tech: newTech,
                },
                message: "Recruit Posting Success",
            });
            expect(noticeRepository.create).toHaveBeenCalledWith(newCorpId, newRecruitPos, newRecruitPay, newRecruitContent, newTech);
        });
    });

    // describe('getDetailNotice', () => {
    //     let corpId, noticeId, request, response;

    //     beforeEach(() => {
    //         noticeId = faker.random.number(1);
    //         corpId = faker.random.alphaNumeric(10);
    //         request = httpMocks.createRequest({
    //             params: { notice_id: noticeId }
    //         });
    //         response = httpMocks.createResponse();
    //     });

    //     it('returns the notice if notice exists', async () => {
    //         const detail = {
    //             notice_id: noticeId,
    //             recruit_pos: faker.random.words(10),
    //             recruit_pay: faker.random.words(10),
    //             recruit_content: faker.random.words(10),
    //             tech: faker.random.words(10),
    //             corp_id: corpId,
    //         }
    //         noticeRepository.getNoticeById = jest.fn(() => {
    //             return {
    //                 ...detail,
    //             }
    //         });
    //         const result = {
    //             corp_name: faker.random.words(5),
    //             country: faker.random.words(10),
    //             region: faker.random.words(10),
    //         };
    //         // delete detail.corp_id;
    //         corpRepository.getCorpById = jest.fn(() => {
    //             return {
    //                 ...result,
    //             }
    //         })
    //         delete detail.corp_id;
    //         noticeRepository.getDetail = jest.fn(() => {
    //             return {
    //                 ...detail,
    //                 ...result
    //             };
    //         });

    //         await recruitController.getDetailNotice(request, response);

    //         expect(response.statusCode).toBe(200);
    //         // expect(response._getJSONData()).toMatchObject({
    //         //     ...detail,
    //         //     ...result,
    //         // });
    //     })
    // })

    describe('getAllNotices', () => {
        it('returns all tweets without any searching keywords', async () => {
            const request = httpMocks.createRequest();
            const response = httpMocks.createResponse();
            const allNotices = [
                {
                    notice_id: faker.random.number(5),
                    corp_name: faker.random.words(5),
                    country: faker.random.words(10),
                    region: faker.random.words(10),
                    recruit_pos: faker.random.words(5),
                    recruit_pay: faker.random.number(7),
                    tech: faker.random.words(5),
                },
                {
                    notice_id: faker.random.number(5),
                    corp_name: faker.random.words(5),
                    country: faker.random.words(10),
                    region: faker.random.words(10),
                    recruit_pos: faker.random.words(5),
                    recruit_pay: faker.random.number(7),
                    tech: faker.random.words(5),
                },
            ];
            noticeRepository.getAll = () => allNotices;

            await recruitController.getAllNotices(request, response);

            expect(response.statusCode).toBe(200);
            expect(response._getJSONData()).toEqual(allNotices);
        });
    });

    describe('modifyRecruitNotice', () => {
        let noticeId, recruitPos, recruitPay, recruitContent, tech, request, response;
        beforeEach(() => {
            noticeId = faker.random.number(5);
            recruitPos = faker.random.words(10);
            recruitPay = faker.random.words(10);
            recruitContent = faker.random.words(10);
            tech = faker.random.words(10);
            request = httpMocks.createRequest({
                body: {
                    recruit_pos: recruitPos,
                    recruit_pay: recruitPay,
                    recruit_content: recruitContent,
                    tech
                },
                params: { notice_id: noticeId },
            });
            response = httpMocks.createResponse();
        });

        it('returns 200 with updated Notice object', async () => {
            const modified = {
                notice_id: noticeId,
                recruit_pos: recruitPos,
                recruit_pay: recruitPay,
                recruit_content: recruitContent,
                tech
            };
            noticeRepository.getNoticeById = () => ({
                notice_id: noticeId,
                recruit_pos: faker.random.words(10),
                recruit_pay: faker.random.words(10),
                recruit_content: faker.random.words(10),
                tech: faker.random.words(10),
            });
            noticeRepository.update = (noticeId, modified) => (modified);

            await recruitController.modifyRecruitNotice(request, response);

            expect(response.statusCode).toBe(200);
            expect(response._getJSONData()).toEqual(modified);
        });

        it('returns 404 and should not update the repository if the notice does not exist', async () => {
            noticeRepository.getNoticeById = () => undefined;
            noticeRepository.update = jest.fn();

            await recruitController.modifyRecruitNotice(request, response);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('removeRecruitNotice', () => {
        let noticeId, recruitPos, recruitPay, recruitContent, tech, request, response;
        beforeEach(() => {
            noticeId = faker.random.number(5);
            recruitPos = faker.random.words(10);
            recruitPay = faker.random.words(10);
            recruitContent = faker.random.words(10);
            tech = faker.random.words(10);
            request = httpMocks.createRequest({
                params: { noticd_id: noticeId },
            });
            response = httpMocks.createResponse();
        });

        it('returns 204 and remove the notice from the repository if the notice exists', async () => {
            noticeRepository.getNoticeById = () => ({
                notice_id: noticeId,
                recruit_pos: faker.random.words(10),
                recruit_pay: faker.random.words(10),
                recruit_content: faker.random.words(10),
                tech: faker.random.words(10),
            });
            noticeRepository.remove = jest.fn();

            await recruitController.removeRecruitNotice(request, response);

            expect(response.statusCode).toBe(204);
            expect(response._getJSONData().message).toBe('Destroy Success');
        });

        it('returns 404 and should not update the repository if the notice does not exist', async () => {
            noticeRepository.getNoticeById = () => undefined;
            noticeRepository.remove = jest.fn();

            await recruitController.removeRecruitNotice(request, response);

            expect(response.statusCode).toBe(404);
            expect(response._getJSONData().message).toBe('Notice is not found!');
        })
    })

})