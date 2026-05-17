 const express = require('express');
 const router = express.Router();
 const Notification = require('../models/Notification');
 const authMiddleware = require('../middleware/authMiddleware');
  router.use(authMiddleware);
  // GET /api/notifications
 // Notifications de l'utilisateur connecte
 router.get('/', async (req, res) => {
 try {
 const notifications = await Notification.find({
 destinataire: req.userId
 })
 .sort({ createdAt: -1 })
 .limit(20);
  const nonLues = await Notification.countDocuments({
 destinataire: req.userId,
 lue: false
 });
  res.json({ notifications, nonLues });
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
  // PATCH /api/notifications/:id/read
 // Marquer une notification comme lue
 router.patch('/:id/read', async (req, res) => {
 try {
 const notif = await Notification.findByIdAndUpdate(
 req.params.id,
 { lue: true },
 { new: true }
 );
 res.json(notif);
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
  // PATCH /api/notifications/read-all
 // Marquer toutes comme lues
 router.patch('/read-all', async (req, res) => {
 try {
 await Notification.updateMany(
 { destinataire: req.userId, lue: false },
 { lue: true }
 );
 res.json({ message: 'Toutes marquees comme lues' });
 } catch (error) {
 res.status(500).json({ message: 'Erreur serveur', error: error.message });
 }
 });
  module.exports = router;