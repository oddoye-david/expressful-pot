import config from '../../config';
import winston from 'winston';

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.File(config.winston.options.file),
    new winston.transports.Console(config.winston.options.console)
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding){
    logger.info(message);
  }
};

export default logger;