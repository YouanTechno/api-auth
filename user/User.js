var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  nom: String,
  prenom: String,
  statut : String,
  email: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');