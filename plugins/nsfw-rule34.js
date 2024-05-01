import { googleImage, pinterest } from '@bochilteam/scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].nsfw) throw `🚫 El grupo no admite contenido nsfw \n\n Para habilitar escriba \n*${usedPrefix}enable* nsfw`

    if (!text) throw `*•Ingresa un texto*\n\n*Ejemplo:*\n*${usedPrefix}${command}* Hinata`
    await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
    try {
    const res = await (await googleImage('rule34 ' + text)).getRandom()
    //conn.sendFile(m.chat, res, 'error.jpg', `*Nsfw Rule34* ${text ? text.capitalize() : false}`, estilo)
    //conn.sendButton(m.chat,`*Nsfw Rule34* ${text ? text.capitalize() : false}`, '• Click en siguiente para ir a la siguiente imagen', res,['▷▷ SIGUIENTE', `.${command} ${text}`], fakemsg, adgp)
    conn.sendFile(m.chat, res, 'out.png', `Nsfw Rule34: *${text ? text.capitalize() : false}*`.trim(), m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': true, externalAdReply:{ showAdAttribution: false, title: botname, body: `h`, mediaType: 2, sourceUrl: linkgc, thumbnail: miniurl}, mentions: [m.sender]}}, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
} catch (err) {
}}
handler.help = ['rule34 *<texto>*']
handler.tags = ['nsfw']
handler.command = ['rule34']
handler.register = true
handler.limit = 1
export default handler