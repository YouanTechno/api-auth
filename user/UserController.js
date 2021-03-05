var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

// CREER UN NOUVEL UTILISATEUR
router.post('/', function (req, res) {
    User.create({
            nom: req.body.nom,
            prenom: req.body.prenom,
            statut : req.body.statut,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("Il y a eu un problème pour ajouter les informations dans la base de données.");
            res.status(200).send(user);
        });
});

// RENVOIE TOUS LES UTILISATEURS DANS LA BASE DE DONNÉES
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("Il y a eu un problème pour trouver les utilisateurs.");
        res.status(200).send(users);
    });
});

// OBTIENT UN SEUL UTILISATEUR DE LA BASE DE DONNÉES
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("Il y a eu un problème pour trouver l'utilisateur.");
        if (!user) return res.status(404).send("Aucun utilisateur trouvé.");
        res.status(200).send(user);
    });
});

// SUPPRIME UN UTILISATEUR DE LA BASE DE DONNÉES
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("Il y a eu un problème de suppression de l'utilisateur.");
        res.status(200).send("Utilisateur : "+ user.name +" a été supprimé.");
    });
});

// MET À JOUR UN SEUL UTILISATEUR DANS LA BASE DE DONNÉES
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("Il y a eu un problème de mise à jour de l'utilisateur.");
        res.status(200).send(user);
    });
});


module.exports = router;