const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');
// Toutes les routes sont protegees
router.use(authMiddleware);
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// GET /api/projects/:id/tasks
// Recuperer toutes les taches d'un projet
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.get('/projects/:id/tasks', async (req, res) => {
try {
const taches = await Task.find({ projet: req.params.id });
res.json(taches);
} catch (error) {
res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
});
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// POST /api/tasks
// Creer une nouvelle tache
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.post('/', async (req, res) => {
try {
const { titre, description, priorite, statut, projet, dateLimite } = req.body;
if (!titre || !projet) {
 return res.status(400).json({ message: 'Titre et projet obligatoires' });
 }
  const tache = new Task({ titre, description, priorite, statut, projet, dateLimite });
 await tache.save();
  res.status(201).json(tache);
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 // GET /api/projects/:id/tasks
// Recuperer toutes les taches d'un projet AVEC les infos du membre assigne
 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 
router.get('/projects/:id/tasks', async (req, res) => {
try {
  const taches = await Task.find({ projet: req.params.id })
    .populate(
      'assignedTo',
      'nom prenom email'
    );
  res.json(taches);
} catch (error) {
  res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
});
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 // PUT /api/tasks/:id
 // Modifier une tache
 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 router.put('/:id', async (req, res) => {
 try {
 const tache = await Task.findByIdAndUpdate(
 req.params.id,
 req.body,
 { new: true, runValidators: true }
 );
 if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
 res.json(tache);
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
  // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 // DELETE /api/tasks/:id
 // Supprimer une tache
 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
 router.delete('/:id', async (req, res) => {
 try {
 const tache = await Task.findByIdAndDelete(req.params.id);
 if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
 res.json({ message: 'Tache supprimee avec succes' });
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
 // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// PATCH /api/tasks/:id/status
// Mettre a jour UNIQUEMENT le statut d'une tache
// Exemple : { "statut": "en cours" }
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
router.patch('/:id/status', async (req, res) => {
try {
const { statut } = req.body;
// Verifier que le statut est valide
const statutsValides = ['a faire', 'en cours', 'termine'];
if (!statutsValides.includes(statut)) {
return res.status(400).json({
message: 'Statut invalide. Valeurs acceptees : a faire, en cours, termine'
});
}
const tache = await Task.findByIdAndUpdate(
req.params.id,
{ statut }, // mettre a jour SEULEMENT le statut
{ new: true }
);
if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
res.json(tache);
} catch (error) {
res.status(500).json({ message: 'Erreur serveur', error: error.message });
}
});
// PATCH /api/tasks/:id/assign
router.patch('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const tache = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'nom prenom email');
    if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/tasks/mes-taches
router.get('/mes-taches', async (req, res) => {
  try {
    const taches = await Task.find({
      assignedTo: req.userId,
    })
    .populate('projet', 'titre')
    .populate('assignedTo', 'nom prenom email');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
// GET /api/projects/:id/mes-taches
router.get('/projects/:id/mes-taches', async (req, res) => {
  try {
    const taches = await Task.find({
      projet:     req.params.id,
      assignedTo: req.userId
    })
    .populate('assignedTo', 'nom prenom email')
    .sort({ priorite: -1 });

    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

    module.exports = router;

  