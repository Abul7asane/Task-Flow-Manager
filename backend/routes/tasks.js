const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Toutes les routes sont protegees
router.use(authMiddleware);

// GET /api/projects/:id/tasks
// Recuperer toutes les taches d'un projet AVEC les infos du membre assigne
// Avec filtrage conditionnel, recherche $regex et pagination
router.get('/projects/:id/tasks', async (req, res) => {
  try {
    // Recuperer les query params depuis l'URL
    // Exemple : /api/projects/123/tasks?statut=en cours&priorite=haute&page=1&limit=5
    const { statut, priorite, assignedTo, recherche, page, limit } = req.query;
    // Construire le filtre de base : appartient a ce projet
    const filtre = { projet: req.params.id };
    // Conditions ajoutees SEULEMENT si le parametre est present
    if (statut) filtre.statut = statut;
    if (priorite) filtre.priorite = priorite;
    if (assignedTo) filtre.assignedTo = assignedTo;
    // Recherche $regex avec option i (insensible a la casse)
    // Cherche dans titre OU description
    if (recherche) {
      filtre.$or = [
        { titre: { $regex: recherche, $options: 'i' } },
        { description: { $regex: recherche, $options: 'i' } }
      ];
    }
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    // Executer la requete
    const taches = await Task.find(filtre)
      .populate('assignedTo', 'nom prenom email')
      .skip(skip)
      .limit(limitNum);
    // Compter le total
    const total = await Task.countDocuments(filtre);
    // Reponse JSON avec data + infos pagination
    res.json({
      data: taches,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/tasks
// Creer une nouvelle tache
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

// GET /api/tasks/:id
// Recuperer une tache par son id
router.get('/:id', async (req, res) => {
  try {
    const tache = await Task.findById(req.params.id);
    if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PUT /api/tasks/:id
// Modifier une tache
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

// DELETE /api/tasks/:id
// Supprimer une tache
router.delete('/:id', async (req, res) => {
  try {
    const tache = await Task.findByIdAndDelete(req.params.id);
    if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
    res.json({ message: 'Tache supprimee avec succes' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PATCH /api/tasks/:id/status
// Mettre a jour UNIQUEMENT le statut d'une tache
router.patch('/:id/status', async (req, res) => {
  try {
    const { statut } = req.body;
    const statutsValides = ['a faire', 'en cours', 'termine'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({
        message: 'Statut invalide. Valeurs acceptees : a faire, en cours, termine'
      });
    }
    const tache = await Task.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );
    if (!tache) return res.status(404).json({ message: 'Tache non trouvee' });
    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// PATCH /api/tasks/:id/assign
// Assigner une tache a un membre
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
// Taches assignees au membre connecte
router.get('/mes-taches', async (req, res) => {
  try {
    const taches = await Task.find({ assignedTo: req.userId })
      .populate('projet', 'titre')
      .populate('assignedTo', 'nom prenom email');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/projects/:id/mes-taches
// Conditions multiples : projet + membre
router.get('/projects/:id/mes-taches', async (req, res) => {
  try {
    const taches = await Task.find({
      projet: req.params.id,
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