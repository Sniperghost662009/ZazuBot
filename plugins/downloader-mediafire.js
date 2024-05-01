import { mediafiredl } from '@bochilteam/scraper'
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let limit = 850
    if (!args[0]) throw `*• Ingresα el link de Mediafire*`
    await conn.sendMessage(m.chat, { react: { text: '🕜', key: m.key }});
    let res = await mediafiredl(args[0])
    let { url, url2, filename, ext, aploud, filesize, filesizeH } = res
    let caption = `
*📓 Nombre:* ${filename}
*📁 Peso:* ${filesizeH}
*📄 Tipo:* ${ext}
*🕐 Subido:* ${aploud}
`.trim()
if (filesizeH.split('MB')[0] >= limit) return m.reply(`El archivo pesa mas de ${limit} MB, se canceló la Descarga.`).then(_ => m.react('✖️'))
conn.sendMessage(m.chat, {
text: caption,
contextInfo: {
externalAdReply: {
title: botname,
body: 'bodynya',
thumbnailUrl: 'https://telegra.ph/file/362fa2d3ade8f61b1276f.jpg',
sourceUrl: [global.linkgc, global.linkgc2, global.linkgc3, global.linkgc4, global.linkgc5].getRandom(),
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
    //m.reply(caption)
    await conn.sendFile(m.chat, url, filename, '', m, null, { mimetype: ext, asDocument: true })
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}
handler.help = ['mediafire'].map(v => v + ' *<url>*')
handler.tags = ['downloader', 'premium']
handler.command = /^(mediafire|mf)$/i
handler.premium = true 

export default handler