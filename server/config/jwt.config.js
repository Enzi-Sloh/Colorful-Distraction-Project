const jwt = require("jsonwebtoken");
const secret = "I can't believe this key is so secret!";
const jwtconfig ={
    secret: secret,
    authenticate: (req, res, next) => {
        jwt.verify(req.cookies.usertoken, secret, (err, payload) => {
          if (err) { 
            res.status(401).json({verified: false});
          } else {
            res.status(401).json({verified: true});
            next();
          }
        })}
}
//console.log(jwtconfig)
module.exports = jwtconfig;