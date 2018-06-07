var express = require('express');
var router  = express.Router();
//var ExpertController = require('../controllers/ExpertController');
var jwt     = require('jsonwebtoken');

var isAuthenticated = function(req, res, next) {
    //Saves token from request header
    var token = req.headers['token'];
    if (!token)
      return res.status(401).json({error: null, msg: 'User not logged in', data: null});

    // Verify token and decodes it
    jwt.verify(token, req.app.get('secret'), function(err, decodedToken) {
      if (err)
        return res.status(401).json({ error: err, msg: 'Login timed out', data: null });

      req.decodedToken = decodedToken;
      next();
    });
};
  
var isNotAuthenticated = function(req, res, next) {
    var token = req.headers['token'];
    if (token)
      return res.status(403).json({ error: null, msg: 'You are already logged in.', data: null});

    next();
  };

//--------------USER------------------
//router.post('/user/signUp', user.signUp);


module.exports = router;




