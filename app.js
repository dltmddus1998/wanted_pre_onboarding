import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { sequelize } from './db/database.js';
import { config } from './config.js';
import recruitRouter from './router/recruit_notice.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/recruit', recruitRouter);

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
