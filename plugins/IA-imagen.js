import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command}) => {
if (!text) return conn.reply(m.chat, `*_ingresa un texto de la imagen que quieres_*\n\n> ejemplo:\n\n ${usedPrefix + command} crea un gato en una cama`,  m,  )
  
  /* if (!text) {
    throw '*_ingresa un texto de la imagen que quieres_*\n\n*ejemplo:*\n\n ${usedPrefix + command} crea un gato en una cama';
             }*/

  try {
    conn.sendPresenceUpdate('composing', m.chat);

    const apiUrl = `${apikasu}/api/tools/imagine2?text=${encodeURIComponent(text)}&apikey=${apikeykasu}`;

    const response = await fetch(apiUrl);
    const buffer = await response.buffer();

    if (response.ok) {
      conn.sendFile(m.chat, buffer, 'imagen.jpg', '', m);
    } else {
      throw `*ZazuBot*「 *ERROR* 」\n\nOcurrió un *Error*`;
    }
  } catch (error) {
    throw `*ZazuBot*「 *ERROR* 」\n\nOcurrió un *Error*`;
  }
};

handler.help = ['ɪᴀɪᴍᴀɢᴇɴ'];
handler.tags = ['ia'];
handler.command = /^iaimagen$/i;

export default handler;
