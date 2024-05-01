import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].nsfw) throw `🚫 El grupo no admite contenido nsfw \n\n Para habilitar escriba \n*${usedPrefix}enable* nsfw`
if (!args[0]) throw `*• Ingresa el enlace del vídeo de Xvideos*`;
await conn.sendMessage(m.chat, { react: { text: '🕜', key: m.key }});
try {
let video = await getXvideosVideo(args[0]);
conn.sendMessage(m.chat, { document: { url: video.url }, mimetype: 'video/mp4', fileName: video.title }, { quoted: m });
await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
} catch (e) {
}};
handler.help = ['xvideosdl *<url>*'];
handler.tags = ['downloader', 'nsfw'];
handler.command = /^(xvideosdl)$/i;
handler.limit = 80
handler.register = true 
export default handler;

async function getXvideosVideo(url) {
try {
const response = await fetch(url, { method: 'get' });
const res = await response.text();
const $ = cheerio.load(res, { xmlMode: false });
const title = $("meta[property='og:title']").attr('content');
const videoUrl = $("#html5video > #html5video_base > div > a").attr('href');
return { title, url: videoUrl };
} catch (err) {
}}