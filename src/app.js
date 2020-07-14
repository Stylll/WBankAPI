import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize routes;
routes(app);

export default app;
