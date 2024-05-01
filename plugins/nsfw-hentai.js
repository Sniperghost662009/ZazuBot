import { googleImage, pinterest } from '@bochilteam/scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].nsfw) throw `🚫 El grupo no admite contenido nsfw \n\n Para habilitar escriba \n*${usedPrefix}enable* nsfw`


    await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
    try {
    const res = await (await googleImage('Imagen ' + 'hentai')).getRandom()
    conn.sendFile(m.chat, res, 'error.jpg', `*Aqui tiene ฅ^•ﻌ•^ฅ*`, estilo)
    //conn.sendButton(m.chat,`*Nsfw Rule34* ${text ? text.capitalize() : false}`, '• Click en siguiente para ir a la siguiente imagen', res,['▷▷ SIGUIENTE', `.${command} ${text}`], fakemsg, adgp)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
} catch (err) {
}}
handler.help = ['hentai']
handler.tags = ['nsfw']
handler.command = ['hentai']
handler.group = true 
handler.register = true
handler.limit = 1
export default handler