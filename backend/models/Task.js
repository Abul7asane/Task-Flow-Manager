 const mongoose = require('mongoose');
  const taskSchema = new mongoose.Schema({
  // Titre obligatoire
 titre: {
 type: String,
 required: [true, 'Le titre est obligatoire'],
 trim: true
 },
  // Description optionnelle
 description: {
 type: String,
 default: ''
 },
  // Priorite — 3 valeurs possibles uniquement (enum)
 priorite: {
 type: String,
 enum: ['basse', 'moyenne', 'haute'],
 required: [true, 'La priorite est obligatoire'],
 default: 'moyenne'
 },
  // Statut — 3 valeurs possibles uniquement (enum)
 statut: {
 type: String,
 enum: ['a faire', 'en cours', 'termine'],
 required: [true, 'Le statut est obligatoire'],
 default: 'a faire'
 },
  // Reference vers le projet parent (obligatoire)
 projet: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Project',
 required: [true, 'La tache doit appartenir a un projet']
 },
 // NOUVEAU : membre assigne a cette tache
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null
},
  // Date limite optionnelle
 dateLimite: {
 type: Date,
 required: false
 }
  }, {
 timestamps: true
 });
  module.exports = mongoose.model('Task', taskSchema);