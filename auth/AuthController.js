// AuthController.js

var VerifyToken = require('./VerifyToken');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/enregistrer', function(req, res) {
  
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    User.create({
      nom : req.body.nom,
      prenom: req.body.prenom,
      statut: req.body.statut,
      email : req.body.email,
      password : hashedPassword
    },
    function (err, user) {
      if (err) return res.status(500).send("Il y a eu un problème d'enregistrement de l'utilisateur.")
      // creation de jeton
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expire dans 24 heures
      });
      res.status(200).send({ auth: true, token: token });
    }); 
  });

  router.get('/recherche',VerifyToken, function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Aucun jeton fourni.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Échec d authentification du jeton.' });
      
      User.findById(decoded.id, 
        { password: 0 }, // projection
        function (err, user) {
          if (err) return res.status(500).send("Il y a eu un problème pour trouver l'utilisateur.");
          if (!user) return res.status(404).send("Pas d'utilisateur trouvé.");
          
          res.status(200).send(user);
      });
    });
  });

  router.post('/connexion', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Erreur sur le serveur.');
      if (!user) return res.status(404).send('Aucun utilisateur trouver.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires dans 24 heures
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  });

  router.get('/deconnexion', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });


  module.exports = router;