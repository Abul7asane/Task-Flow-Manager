const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/activities/task/:id
// Historique d'une tache
router.get('/task/:id', async (req, res) => {
  try {
    const activites = await Activity.find({ tache: req.params.id })
      .populate('utilisateur', 'nom prenom email')
      .sort({ createdAt: -1 });
    res.json(activites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
// POST /api/activities
// Enregistrer une nouvelle action
router.post('/', async (req, res) => {
  try {
    const { action, tache, details } = req.body;
    const activite = new Activity({
      action,
      tache,
      utilisateur: req.userId,
      details
    });
    await activite.save();
    res.status(201).json(activite);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;