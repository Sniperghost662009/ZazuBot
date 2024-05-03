let handler = async (m, { conn }) => {
  if (global.conn.user.jid === conn.user.jid) {
  } else {
    await conn.reply(m.chat, `Desconectando...`, m)
    conn.ws.close()
  }
}
handler.help = ['ꜱᴛᴏᴘ']
handler.tags = ['jadibot']
handler.command = ['stop', 'stopbot', 'stopbebot']
handler.owner = true

export default handler
