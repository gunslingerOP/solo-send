
const rateLimit = require("express-rate-limit");
 

 
const apiLimiter = rateLimit({
  windowMs: 1440 * 60 * 1000, // 15 minutes
  max: 5,
  message:
  "You have exceeded your daily tries, try again in 1 day",
  headers: true

});

export default apiLimiter