// services/analyticsService.js
const logger = require('../config/logger');

const trackEvent = async (eventName, metadata) => {
  try {
    // Logic to send event data to an analytics platform like Google Analytics, Mixpanel, etc.
    logger.info(`Event tracked: ${eventName}`, { metadata });
  } catch (error) {
    logger.error('Error tracking event:', { error: error.message });
  }
};

module.exports = { trackEvent };
