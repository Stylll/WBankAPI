import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

// const port = process.env.PORT || 3000;
const app = express();
// const address = `http://localhost:${port}/api/v1`;

// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize routes;
routes(app);

// Listen at designated port
// app.listen(port, (error) => {
//     console.log(`Server running on port ${port}`);
// });

export default app;