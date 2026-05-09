// Adresse du serveur backend
const API = 'http://localhost:3000/api/auth';

// FONCTION : afficher un message à l'utilisateur
function afficherMessage(texte, type) {
  const div = document.getElementById('message');
  div.textContent = texte;
  div.className = 'message ' + type;  // 'erreur' ou 'succes'
  div.style.display = 'block';
}

// FONCTION INSCRIPTION
async function sInscrire() {
  const nom        = document.getElementById('nom').value;
  const prenom     = document.getElementById('prenom').value;
  const email      = document.getElementById('email').value;
  const motDePasse = document.getElementById('motDePasse').value;

  // Vérification simple : tous les champs sont remplis ?
  if (!nom || !prenom || !email || !motDePasse) {
    afficherMessage('Veuillez remplir tous les champs', 'erreur');
    return;
  }

  try {
    // Envoi des données au serveur avec fetch
    const reponse = await fetch(API + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email, motDePasse })
    });

    const donnees = await reponse.json();

    if (reponse.ok) {
      afficherMessage('Compte créé ! Redirection...', 'succes');
      // Rediriger vers la page de connexion après 1 seconde
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      afficherMessage(donnees.message, 'erreur');
    }

  } catch (erreur) {
    afficherMessage('Impossible de contacter le serveur', 'erreur');
  }
}

// FONCTION CONNEXION
async function seConnecter() {
  const email      = document.getElementById('email').value;
  const motDePasse = document.getElementById('motDePasse').value;

  if (!email || !motDePasse) {
    afficherMessage('Veuillez remplir tous les champs', 'erreur');
    return;
  }

  try {
    // Envoi des identifiants au serveur
    const reponse = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse })
    });

    const donnees = await reponse.json();

    if (reponse.ok) {
      // IMPORTANT : on sauvegarde le token JWT dans localStorage
      // Ce token sera envoyé à chaque requête future
      localStorage.setItem('token', donnees.token);
      localStorage.setItem('user', JSON.stringify(donnees.user));

      afficherMessage('Connexion réussie !', 'succes');
      // Rediriger vers le tableau de bord
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    } else {
      afficherMessage(donnees.message, 'erreur');
    }

  } catch (erreur) {
    afficherMessage('Impossible de contacter le serveur', 'erreur');
  }
}

// VÉRIFICATION AU CHARGEMENT DE LA PAGE
// Si un token existe déjà → l'utilisateur est déjà connecté
window.onload = function() {
  const token = localStorage.getItem('token');
  if (token && window.location.pathname.includes('index.html')) {
    window.location.href = 'dashboard.html';
  }
};