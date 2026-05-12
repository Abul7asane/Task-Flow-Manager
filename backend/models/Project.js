const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Titre obligatoire
  titre: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true
  },
  // Description obligatoire
  description: {
    type: String,
    required: [true, 'La description est obligatoire']
  },
  // Date limite — optionnelle (required: false)
  dateLimite: {
    type: Date,
    required: false
  },
  // Statut — seulement 3 valeurs possibles (enum)
  statut: {
    type: String,
    enum: ['actif', 'en pause', 'archivé'],
    default: 'actif'
  },
  // Createur — reference vers la collection User
  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
// NOUVEAU : liste des membres du projet
// Tableau d'ObjectId qui referencent la collection users
membres: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'User'
}],
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});
// 
// SUPPRESSION EN CASCADE
// Quand un projet est supprime, toutes ses taches sont supprimees
// 
projectSchema.pre('deleteOne', { document: true }, async function(next) {
  await mongoose.model('Task').deleteMany({ projet: this._id });
  //next();
});

module.exports = mongoose.model('Project', projectSchema);