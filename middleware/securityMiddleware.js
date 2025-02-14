// middleware/securityMiddleware.js
import helmet from 'helmet';
import xssClean from 'xss-clean';

const securityMiddleware = (app) => {
  // Use Helmet to secure HTTP headers
  app.use(helmet());

  // Use xss-clean to sanitize input data
  app.use(xssClean());
};

export default securityMiddleware;
