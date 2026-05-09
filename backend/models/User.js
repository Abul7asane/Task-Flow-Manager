const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// On définit la structure d'un utilisateur
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true   // obligatoire
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true     // deux utilisateurs ne peuvent pas avoir le même email
  },
  motDePasse: {
    type: String,
    required: true
  }
}, {
  timestamps: true   // ajoute automatiquement createdAt et updatedAt
});

// AVANT de sauvegarder → on hache le mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  // bcrypt transforme "1234" en "$2b$10$xyz..."
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  //next();
});

module.exports = mongoose.model('User', userSchema);
