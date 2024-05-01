let handler = async (m, { conn }) => {
let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;
conn.reply(m.chat, `  *T O T A L - P L U G I N S*

╭──────────────────────\n✯ *_plugins:_* ${totalf}\n╰──────────────────────`, m, )
}

handler.help = ['totalplugins']
handler.tags = ['main']
handler.command = ['totalplugins']

export default handler 
