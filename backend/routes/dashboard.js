const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/dashboard — toutes les metriques en UN SEUL appel
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const maintenant = new Date();
    // 1. Projets actifs — $match + $count
    const projetsActifs = await Project.aggregate([
      { $match: { createur: userId, statut: 'actif' } },
      { $count: 'total' }
    ]);
    // 2. Taches assignees a moi
    const tachesAssignees = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $count: 'total' }
    ]);
    // 3. Taches terminees
    const tachesTerminees = await Task.aggregate([
      { $match: { assignedTo: userId, statut: 'terminé' } },
      { $count: 'total' }
    ]);
    // 4. Taches EN RETARD
    // date limite depassee ET statut different de termine
    const tachesEnRetard = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          statut: { $ne: 'terminé' }, // $ne = different de
          dateLimite: { $lt: maintenant } // $lt = avant maintenant
        }
      },
      { $count: 'total' }
    ]);
    // 5. Taches en cours triees par priorite puis date limite
    const tachesEnCours = await Task.find({
      assignedTo: userId,
      statut: 'en cours'
    })
      .sort({ priorite: -1, dateLimite: 1 })
      .populate('projet', 'titre');
    // Reponse avec toutes les metriques
    res.json({
      projetsActifs: projetsActifs[0]?.total || 0,
      tachesAssignees: tachesAssignees[0]?.total || 0,
      tachesTerminees: tachesTerminees[0]?.total || 0,
      tachesEnRetard: tachesEnRetard[0]?.total || 0,
      tachesEnCours
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router
