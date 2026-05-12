const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

// Toutes les routes sont protegees par JWT
router.use(authMiddleware);

// 
// GET /api/projects
// Recuperer tous les projets avec PAGINATION
// Exemple : /api/projects?page=1&limit;=10
// 
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const projets = await Project.find({ createur: req.userId })
      .skip(skip)
      .limit(limit);
    const total = await Project.countDocuments({ createur: req.userId });
    res.json({
      data: projets,
      page,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// 
// POST /api/projects
// Creer un nouveau projet
// 
router.post('/', async (req, res) => {
  try {
    const { titre, description, dateLimite } = req.body;
    if (!titre || !description) {
      return res.status(400).json({ message: 'Titre et description obligatoires' });
    }
    const projet = new Project({
      titre,
      description,
      dateLimite,
      createur: req.userId // l'utilisateur connecte est le createur
    });
    await projet.save();
    res.status(201).json(projet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// 
// PUT /api/projects/:id
// Modifier un projet existant
// 
router.put('/:id', async (req, res) => {
  try {
    const projet = await Project.findOneAndUpdate(
      { _id: req.params.id, createur: req.userId },
      req.body,
      { new: true } // retourner le document mis a jour
    );
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouve' });
    }
    res.json(projet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// 
// DELETE /api/projects/:id
// Supprimer un projet ET toutes ses taches (cascade)
// 
router.delete('/:id', async (req, res) => {
  try {
    const projet = await Project.findOne({
      _id: req.params.id,
      createur: req.userId
    });
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouve' });
    }
    // deleteOne() declenche le middleware pre('deleteOne') dans Project.js
    // qui supprime automatiquement toutes les taches du projet
    await projet.deleteOne();
    res.json({ message: 'Projet et ses taches supprimes avec succes' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;