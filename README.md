# Task-Flow-Manager
Projet de fin de module — Développement d'une application web [ fullstack ]  Module : JavaScript · Express · MongoDB · Docker · GitHub

# Plan Complet TaskFlow — De A à Z
## Projet : Authentification utilisateur (Fonctionnalité 1)
### 2 personnes — Durée recommandée : 5 à 7 jours

---

## LES TECHNOLOGIES EXPLIQUÉES SIMPLEMENT

### JavaScript (vous connaissez déjà)
- Utilisé partout : dans le navigateur ET sur le serveur
- Côté navigateur : gérer le formulaire, envoyer les données
- Côté serveur : recevoir les données, vérifier, répondre

### Node.js
- Permet d'exécuter JavaScript sur le serveur (pas dans le navigateur)
- C'est l'environnement qui fait tourner votre serveur

### Express
- Une bibliothèque Node.js pour créer un serveur facilement
- Vous définissez des "routes" : quand quelqu'un appelle /login → faire ceci
- Exemple : app.post('/login', (req, res) => { ... })

### MongoDB
- Base de données qui stocke les données sous forme de documents JSON
- Chaque utilisateur est un document : { nom, prenom, email, motDePasse }
- Vous connaissez déjà → parfait

### Mongoose
- Une bibliothèque JavaScript pour communiquer avec MongoDB plus facilement
- Vous définissez la structure d'un utilisateur (schéma)
- Exemple : User.findOne({ email }) → cherche un utilisateur par email

### bcryptjs
- Transforme le mot de passe "1234" en "$2b$10$xyz..." avant de le sauvegarder
- Impossible de retrouver "1234" à partir de "$2b$10$xyz..."
- Protège les mots de passe si quelqu'un vole la base de données

### JWT (JSON Web Token)
- Un "badge" numérique généré par le serveur après connexion réussie
- Contient : l'identifiant de l'utilisateur + une date d'expiration
- Le navigateur le garde dans localStorage et l'envoie à chaque requête
- Le serveur vérifie le badge → si valide → accès autorisé

### Axios
- Bibliothèque JavaScript pour envoyer des requêtes HTTP depuis le navigateur
- Remplace fetch() avec plus de simplicité
- Exemple : axios.post('/api/login', { email, motDePasse })

### Docker
- Une "boîte" qui contient votre serveur + MongoDB
- Démarre tout avec une seule commande : docker-compose up --build
- Garantit que ça fonctionne sur tous les ordinateurs

### GitHub
- Sauvegarde votre code en ligne avec un historique
- Le professeur voit qui a fait quoi et quand
- Commandes essentielles : git add . → git commit -m "message" → git push

---

## STRUCTURE DES FICHIERS DU PROJET

```
taskflow/
├── backend/
│   ├── server.js                ← point d'entrée du serveur Express
│   ├── models/
│   │   └── User.js              ← structure d'un utilisateur dans MongoDB
│   ├── routes/
│   │   └── auth.js              ← routes /register et /login
│   └── middleware/
│       └── authMiddleware.js    ← vérification du token JWT
├── frontend/
│   ├── index.html               ← page de connexion (formulaire)
│   ├── register.html            ← page d'inscription (formulaire)
│   └── app.js                   ← JavaScript côté navigateur
├── .env                         ← secrets (JAMAIS envoyé sur GitHub)
├── .gitignore                   ← liste des fichiers à ignorer
└── docker-compose.yml           ← démarre tout avec une commande
