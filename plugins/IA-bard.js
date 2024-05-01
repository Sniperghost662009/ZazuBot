import fetch from 'node-fetch'

var handler = async (m, { text,  usedPrefix, command }) => {


if (!text) return conn.reply(m.chat, `*_Ingresa un texto_*\n\n> ejemplo:\n\n ${usedPrefix + command} conoces la omniprecencia?`,  m, fake, )

try {

conn.sendPresenceUpdate('composing', m.chat)
var apii = await fetch(`https://aemt.me/bard?text=${text}`)
var res = await apii.json()
await m.reply(res.result)

} catch (error) {
console.error(error)
return conn.reply(m.chat, `*Jotchua-mini 🐶*「 *ERROR* 」\n\nOcurrió un *Error*`, m, fkontak, )
}

}
handler.command = ['bard']
handler.help = ['ʙᴀʀᴅ']
handler.tags = ['ia']

export default handler
