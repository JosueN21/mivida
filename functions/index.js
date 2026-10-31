// --- CÓDIGO PARA EL CLIENTE (Tu página web / index.html o main.js) ---

// 1. Guardar una nueva tarea (esto disparará automáticamente la notificación)
async function crearNuevaTarea(e) {
  e.preventDefault(); // Si viene de un formulario
  
  const tituloInput = document.getElementById("input-tarea"); // ID de tu input en HTML
  const titulo = tituloInput.value;
  const autorActual = "Josué"; // O el usuario que haya iniciado sesión ("Josué" o "Mi Esposita")

  try {
    await db.collection("tasks").add({
      title: titulo,
      author: autorActual,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("¡Tarea creada con éxito en Firestore!");
    tituloInput.value = ""; // Limpiar input
  } catch (error) {
    console.error("Error al crear la tarea:", error);
  }
}

// 2. Enviar un mensaje de chat (esto disparará automáticamente la notificación)
async function enviarMensajeChat(e) {
  e.preventDefault(); // Si viene de un formulario
  
  const mensajeInput = document.getElementById("input-mensaje"); // ID de tu input de chat
  const textoMensaje = mensajeInput.value;
  const remitenteActual = "Josué"; // O "Mi Esposita"

  try {
    await db.collection("chat").add({
      text: textoMensaje,
      sender: remitenteActual,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("¡Mensaje enviado con éxito a Firestore!");
    mensajeInput.value = ""; // Limpiar input
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
}