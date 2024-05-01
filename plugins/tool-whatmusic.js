
import fs from 'fs'
import acrcloud from 'acrcloud'

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
access_key: 'c33c767d683f78bd17d4bd4991955d81',
access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (/audio|video/.test(mime)) {
    if ((q.msg || q).seconds > 20) return m.reply('El archivo cargado es demasiado grande. Te sugerimos cortarlo a un tamaño más pequeño (10-20 segundos) para identificarlo correctamente.')
    
    await conn.reply(m.chat, wait, m)
    let media = await q.download()
    let ext = mime.split('/')[1]
    fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media)
    let res = await acr.identify(fs.readFileSync(`./tmp/${m.sender}.${ext}`))
    let { code, msg } = res.status
    
    if (code !== 0) throw msg
    
    let { title, artists, album, genres, release_date } = res.metadata.music[0]
    let txt = `*_Resultado de Búsqueda_*\n\n• *Título:* ${title}\n• *Artista:* ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'No encontrado'}\n• *Álbum:* ${album.name || 'No encontrado'}\n• *Género:* ${genres !== undefined ? genres.map(v => v.name).join(', ') : 'No encontrado'}\n• *Fecha de lanzamiento:* ${release_date || 'No encontrado'}`
    
    fs.unlinkSync(`./tmp/${m.sender}.${ext}`)
    await conn.reply(m.chat, txt, m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          description: desc,
          body: '𝐉𝐨𝐭𝐜𝐡𝐮𝐚 - 𝐌𝐢𝐧𝐢',
          previewType: 0,
          thumbnail: imagen4,
          sourceUrl: channel
        }
      }
    })
  } else {
    return conn.reply(m.chat, '*_Responde a un audio_*', m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          description: desc,
          body: 'RESPONDE A UN AUDIO',
          previewType: 0,
          thumbnail: imagen4,
          sourceUrl: channel
        }
      }
    })
  }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^quemusica|quemusicaes|whatmusic$/i

export default handler

/*import fs from 'fs'
import acrcloud from 'acrcloud'
let acr = new acrcloud({
host: 'identify-eu-west-1.acrcloud.com',
access_key: 'c33c767d683f78bd17d4bd4991955d81',
access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m) => {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (/audio|video/.test(mime)) { if ((q.msg || q).seconds > 20) return m.reply('El archivo que carga es demasiado grande, le sugerimos que corte el archivo grande a un archivo más pequeño, 10-20 segundos Los datos de audio son suficientes para identificar')
await conn.reply(m.chat, wait, m)
let media = await q.download()
let ext = mime.split('/')[1]
fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media)
let res = await acr.identify(fs.readFileSync(`./tmp/${m.sender}.${ext}`))
let { code, msg } = res.status
if (code !== 0) throw msg
let { title, artists, album, genres, release_date } = res.metadata.music[0]
let txt = `    *_Resultado de Busqueda_* 

• *Titulo:* ${title}
• *Artista:* ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'No encontrado'}
• *Album:* ${album.name || 'No encontrado'}
• *Genero:* ${genres !== undefined ? genres.map(v => v.name).join(', ') : 'No encontrado'}
• *Fecha de lanzamiento:* ${release_date || 'No encontrado'}
`.trim()
fs.unlinkSync(`./tmp/${m.sender}.${ext}`)
await conn.reply(m.chat, txt, m, {contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, body: '𝐉𝐨𝐭𝐜𝐡𝐮𝐚 - 𝐌𝐢𝐧𝐢', previewType: 0, thumbnail: imagen4, sourceUrl: channel}}})
//m.reply(txt)
} else return conn.reply(m.chat,  '*_Responde a un audio_*', m, {contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, body: 'RESPONDE A UN AUDIO', previewType: 0, thumbnail: imagen4, sourceUrl: channel}}})
}
handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^quemusica|quemusicaes|whatmusic$/i
export default handler*/
