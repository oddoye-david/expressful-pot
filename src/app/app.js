import "babel-polyfill";

import config from '../config';

import logger from "./utils/logger";
import mongoose from './utils/mongoose';

import app from '../config/express';

import apiRoutes from './routes/api/v1';
import authRoutes from './routes/auth';

import errorHandlingMiddleware from "./middlewares/errorHandling";

// Connect to Mongo Database
mongoose.connect();

// App Routes
app.use('/api/v1', apiRoutes);
app.use('/auth', authRoutes);

// Error Handling Middleware
app.use(errorHandlingMiddleware);

app.listen(config.app.port, () =>{
  logger.info(`Express server listening on port ${config.app.port} in ${app.get('env')}`)
});