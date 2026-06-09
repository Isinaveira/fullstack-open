const config = require('./utils/config');
const app = require('./app');
const logger = require('./utils/logger');



app.listen(config.APP_PORT, () => {
  logger.info(`Server running on port ${config.APP_PORT}`)
})