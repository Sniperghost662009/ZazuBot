//import db from '../lib/database.js'

let handler = async (m, { conn, isAdmin, isROwner }) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    m.reply('*Chat Baneado con exito*')
}
handler.help = ['banearbot']
handler.tags = ['owner', 'group']
handler.command = ['banearbot', 'banchat']
handler.group = true 
export default handler