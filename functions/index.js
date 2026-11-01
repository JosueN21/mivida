const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Correos fijos para ambos
const BOTH_RECIPIENTS = [
    "josuenavarrocastillo2007@gmail.com",
    "paolamaytaquispe8@gmail.com"
];

// 1. Notificación automática al crear una Tarea (Push + Correo)
exports.sendTaskNotification = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snapshot, context) => {
    try {
      const task = snapshot.data();
      const author = task.author; // "Josué" o "Mi Esposita"
      const title = task.title || "Nueva tarea asignada";
      const description = task.description || "";
      const dueDate = task.dueDate || "Sin fecha";
      const category = task.category || "General";

      // --- A. Crear el documento en la colección mail para enviar los correos ---
      await db.collection("mail").add({
          to: BOTH_RECIPIENTS,
          message: {
              subject: `✨ Nueva tarea asignada: ${title}`,
              text: `${author} ha agregado una nueva tarea (${category}):\n\n"${title}"\n${description ? 'Descripción: ' + description : ''}\nVence: ${dueDate}`
          }
      });

      // --- B. Enviar notificación Push (FCM) ---
      const recipient = author === "Josué" ? "Mi Esposita" : "Josué";
      const tokenDoc = await db.collection("user_tokens").doc(recipient).get();
      
      if (tokenDoc.exists && tokenDoc.data().token) {
          const fcmToken = tokenDoc.data().token;
          const message = {
              token: fcmToken,
              notification: {
                  title: `Nueva tarea de ${author}`,
                  body: title,
              },
              data: {
                  type: "task",
              },
          };
          await admin.messaging().send(message);
          console.log("Notificación push y correo de tarea enviados con éxito.");
      }

      return null;
    } catch (error) {
      console.error("Error al procesar la tarea:", error);
      return null;
    }
  });

// 2. Notificación automática al enviar un Mensaje de Chat (Push + Correo)
exports.sendChatNotification = functions.firestore
  .document("chat/{messageId}")
  .onCreate(async (snapshot, context) => {
    try {
      const chatMessage = snapshot.data();
      const sender = chatMessage.sender; // "Josué" o "Mi Esposita"
      const text = chatMessage.text || "Nuevo mensaje";
      const hasImage = chatMessage.imageUrl ? true : false;

      // --- A. Crear el documento en la colección mail para enviar los correos ---
      await db.collection("mail").add({
          to: BOTH_RECIPIENTS,
          message: {
              subject: `💬 Nuevo mensaje de ${sender} en MIVIDA`,
              text: `${sender} te ha enviado un mensaje en el chat:\n\n"${text || '[Imagen adjunta]'}"`
          }
      });

      // --- B. Enviar notificación Push (FCM) ---
      const recipient = sender === "Josué" ? "Mi Esposita" : "Josué";
      const tokenDoc = await db.collection("user_tokens").doc(recipient).get();
      
      if (tokenDoc.exists && tokenDoc.data().token) {
          const fcmToken = tokenDoc.data().token;
          const message = {
              token: fcmToken,
              notification: {
                  title: `Mensaje de ${sender}`,
                  body: hasImage && !text ? "📷 [Imagen adjunta]" : text,
              },
              data: {
                  type: "chat",
              },
          };
          await admin.messaging().send(message);
          console.log("Notificación push y correo de chat enviados con éxito.");
      }

      return null;
    } catch (error) {
      console.error("Error al procesar el mensaje de chat:", error);
      return null;
    }
  });