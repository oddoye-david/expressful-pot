import express from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';
import logger from "../app/utils/logger";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined", { "stream": logger.stream }));

export default app;