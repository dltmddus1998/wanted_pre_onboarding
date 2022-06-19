# wanted_pre_onboarding

<br>
<br>
<br>


## 🚨 요구사항

### 채용공고 등록

### 채용공고 수정

### 채용공고 삭제

### 채용공고 목록 조회

### 채용 상세 페이지 조회

<br>
<br>
<br>

## ✍️ 구현 과정


🗓 **우선 기본에 충실하여 필수 구현 요소만 구현하고, 이후 가산점 부분 구현할 계획**

### DataBase 설계하기

✔︎ **필요한 모델**

- 회사 - Corporation
    
    필드명 - **회사id(id) - pk**, 회사명(corp_name), 국가(country), 지역(region)
    
- 사용자 - User
    
    필드명 - **사용자id(user_id) - pk**, 사용자이름(user_name), 이메일(email)
    
- 채용 공고 - Notice
    
    필드명 - **공고id(notice_id) - pk**, **회사id(corp_id) - fk**, 채용포지션(recruit_pos), 채용보상금(recruit_pay), 채용내용(recruit_content), 사용기술(tech)
    

<img src="https://user-images.githubusercontent.com/73332608/173386224-5870c5dd-72a5-4bff-acd2-db94486e7f92.png" width="700" height="540">

<br>
<br>

### REST API 설계하기

<img src="https://user-images.githubusercontent.com/73332608/173313000-688e57d8-1131-4984-ba20-8fa5e57ad9b4.png" width="600" height="440">

<Detail>

[📉 REST API 상세하게 보기](https://undefined-333.gitbook.io/untitled/reference/api-reference/undefined)

<br>
<br>
### 기술 스택

JavaScript

MySQL

Sequelize 

Express

### 개발 시작

- [x]  Must Have
    - [x]  채용공고 등록
    - [x]  채용공고 수정
    - [x]  채용공고 삭제
    - [x]  채용 상세페이지 조회
    - [x]  채용공고 목록 조회

**⚙️ 서버 및 데이터 베이스 구성**

```jsx
// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { sequelize } from './db/database.js';
import { config } from './config.js';
import recruitRouter from './router/recruit_notice.js';
import { RecruitController } from './controller/recruit.js';
import * as noticeRepository from './data/notice.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/recruit', recruitRouter(new RecruitController(noticeRepository)));

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

sequelize.sync().then(() => {
    app.listen(config.host.port);
    console.log(`🚀 Server Started!!: ${config.host.port}`);
});
```

**➡️ Sequelize(ORM)을 통한 데이터베이스 설정** 

```jsx
// data/corporation.js
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

```

```jsx
// data/notice.js
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

// controller에서 사용할 데이터베이스 메서드
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
```

```jsx
// data/user.js
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
```

🧰 **라우터 및 컨트롤러 구성**

```jsx
// router/recruit_notice.js
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
```

```jsx
// controller/recruit.js
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
    
        if (!notice_id) {
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
```

- [ ]  Advanced
    - [x]  채용공고 검색하기
    - [x]  Unit Test
    - [ ]  사용자 채용공고 지원
    - [ ]  채용 상세 페이지 조회에서 해당 회사 다른 채용공고 포함

🧪 **Unit Test Code**

1. 환경 설정
    
    `npm i —save-dev jest node-mocks-http`
    
    `npm i --save-dev @babel/plugin-transform-modules-commonjs` - jest는 module로 작동이 불가하므로 테스트에서 자동으로 commonjs로 변환하도록 설정
    
2. **Unit Test 작성**

<aside>
💡 **계속되는 에러때문에 해결 못한 채용 상세 페이지 조회 테스트 코드는 제외.**

</aside>

```jsx
// controller/test/recruit.test.js
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

```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d7029ccd-e02c-43a3-aa75-9cd40d0f2c74/Untitled.png)
