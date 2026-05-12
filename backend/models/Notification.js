const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
// Destinataire de la notification
destinataire: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
// Message de la notification
message: {
type: String,
required: true
},
// Lien vers la tache concernee
tache: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Task'
},
// Notification lue ou non
lue: {
type: Boolean,
default: false
}
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);