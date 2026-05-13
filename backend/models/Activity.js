const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Type d'action effectuee
  action: {
    type: String,
    enum: ['creation', 'modification', 'suppression', 'assignation', 'statut'],
    required: true
  },
  // Tache concernee
  tache: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  // Utilisateur qui a fait l'action
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Details optionnels
  details: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);