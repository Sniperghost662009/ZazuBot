import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*_ingresa un texto_*\n\n> ejemplo:\n\n ${usedPrefix + command}  perro en una cama`;

  try {
    m.reply('*Generando imagen*');

const endpoint = `https://aemt.me/dalle?text=${text}`


  const response = await fetch(endpoint);
    
    if (response.ok) {
      const imageBuffer = await response.buffer();
      await conn.sendFile(m.chat, imageBuffer, 'image.png', null, fkontak);
        
//await conn.sendFile(m.chat, await (await fetch(url)).buffer(), 'dalle.jpg', , m)

    } else {
      throw '*ocurio un error al generar la imagen*';
    }
  } catch {
    throw '*Jotchua-mini 🐶*「 *ERROR* 」\n\nOcurrió un *Error*';
  }
};

handler.help = ['ᴅᴀʟʟ-ᴇ'];
handler.tags = ['ia'];
handler.command = ['dalle', 'gen', 'imagine', 'openai2', 'dall-e'];
export default handler;
