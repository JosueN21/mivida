const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// 1. Notificación automática al crear una Tarea
exports.sendTaskNotification = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snapshot, context) => {
    try {
      const task = snapshot.data();
      const author = task.author; // "Josué" o "Mi Esposita"
      const title = task.title || "Nueva tarea asignada";

      // Determinar el destinatario opuesto
      const recipient = author === "Josué" ? "Mi Esposita" : "Josué";

      // Buscar el token del destinatario en la colección user_tokens
      const tokenDoc = await db.collection("user_tokens").doc(recipient).get();

      if (!tokenDoc.exists) {
        console.log(`No se encontró token para el destinatario: ${recipient}`);
        return null;
      }

      const fcmToken = tokenDoc.data().token;

      if (!fcmToken) {
        console.log(`El token de ${recipient} está vacío.`);
        return null;
      }

      // Estructura del mensaje de notificación
      const message = {
        token: fcmToken,
        notification: {
          title: `Nueva tarea de ${author}`,
          body: title,
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: "task",
        },
      };

      // Enviar la notificación mediante Firebase Cloud Messaging
      const response = await admin.messaging().send(message);
      console.log("Notificación de tarea enviada con éxito:", response);
      return null;
    } catch (error) {
      console.error("Error al enviar la notificación de tarea:", error);
      return null;
    }
  });

// 2. Notificación automática al enviar un Mensaje de Chat
exports.sendChatNotification = functions.firestore
  .document("chat/{messageId}")
  .onCreate(async (snapshot, context) => {
    try {
      const chatMessage = snapshot.data();
      const sender = chatMessage.sender; // "Josué" o "Mi Esposita"
      const text = chatMessage.text || "Nuevo mensaje";

      // Determinar el destinatario opuesto
      const recipient = sender === "Josué" ? "Mi Esposita" : "Josué";

      // Buscar el token del destinatario en la colección user_tokens
      const tokenDoc = await db.collection("user_tokens").doc(recipient).get();

      if (!tokenDoc.exists) {
        console.log(`No se encontró token para el destinatario: ${recipient}`);
        return null;
      }

      const fcmToken = tokenDoc.data().token;

      if (!fcmToken) {
        console.log(`El token de ${recipient} está vacío.`);
        return null;
      }

      // Estructura del mensaje de notificación
      const message = {
        token: fcmToken,
        notification: {
          title: `Mensaje de ${sender}`,
          body: text,
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: "chat",
        },
      };

      // Enviar la notificación mediante Firebase Cloud Messaging
      const response = await admin.messaging().send(message);
      console.log("Notificación de chat enviada con éxito:", response);
      return null;
    } catch (error) {
      console.error("Error al enviar la notificación de chat:", error);
      return null;
    }
  });