const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Automatizar alerta de Tareas
exports.sendTaskNotification = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snapshot, context) => {
    const task = snapshot.data();
    const author = task.author;
    const recipient = author === "Josué" ? "Mi Esposita" : "Josué";

    const tokenDoc = await admin.firestore().collection("user_tokens").doc(recipient).get();
    if (!tokenDoc.exists) return null;

    const token = tokenDoc.data().token;
    const payload = {
      notification: {
        title: `📋 Nueva Tarea de ${author}`,
        body: task.title,
        icon: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
      }
    };
    return admin.messaging().sendToDevice(token, payload);
  });

// Automatizar alerta de Chat
exports.sendChatNotification = functions.firestore
  .document("chat/{chatId}")
  .onCreate(async (snapshot, context) => {
    const msg = snapshot.data();
    const sender = msg.sender;
    const recipient = sender === "Josué" ? "Mi Esposita" : "Josué";

    const tokenDoc = await admin.firestore().collection("user_tokens").doc(recipient).get();
    if (!tokenDoc.exists) return null;

    const token = tokenDoc.data().token;
    const payload = {
      notification: {
        title: `💬 Nuevo mensaje de ${sender}`,
        body: msg.text || "Te ha enviado una foto 📷",
        icon: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
      }
    };
    return admin.messaging().sendToDevice(token, payload);
  });