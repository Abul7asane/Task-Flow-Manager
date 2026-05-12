const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ROUTE INSCRIPTION : POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // 1. On récupère les données envoyées par le formulaire
    const { nom, prenom, email, motDePasse } = req.body;

    // 2. On vérifie si l'email existe déjà dans MongoDB
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // 3. On crée un nouvel utilisateur
    // Le mot de passe sera haché automatiquement (grâce au pre save dans User.js)
    const user = new User({ nom, prenom, email, motDePasse });
    await user.save();   // sauvegarde dans MongoDB

    res.status(201).json({ message: 'Compte créé avec succès' });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ROUTE CONNEXION : POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. On récupère email et mot de passe
    const { email, motDePasse } = req.body;

    // 2. On cherche l'utilisateur dans MongoDB par son email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 3. On compare le mot de passe entré avec celui haché dans MongoDB
    const motDePasseCorrect = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!motDePasseCorrect) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 4. Le mot de passe est correct → on génère un token JWT
    // Ce token contient l'id de l'utilisateur et expire dans 24h
    const token = jwt.sign(
      { userId: user._id },          // contenu du token
      process.env.JWT_SECRET,        // clé secrète (dans .env)
      { expiresIn: '24h' }           // durée de validité
    );

    // 5. On envoie le token au navigateur
    res.json({
      message: 'Connexion réussie',
      token,
      user: { nom: user.nom, prenom: user.prenom, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;