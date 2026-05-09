const jwt = require('jsonwebtoken');

// Cette fonction est exécutée AVANT chaque route protégée
const authMiddleware = (req, res, next) => {
  // 1. On récupère le token dans le header de la requête
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant. Veuillez vous connecter.' });
  }

  // 2. On extrait le token (après "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. On vérifie que le token est valide
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // on ajoute l'userId à la requête
    next();  // on passe à la route suivante

  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = authMiddleware;