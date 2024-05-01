/*import fetch from "node-fetch"
import yts from "yt-search"

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) throw `*• Ingresa el título de una canción*\n\n*Ejemplo:*\n*${usedPrefix + command}* Alan Walker - Sing Me To Sleep`
    await m.react('🕓')
    try {
    let yt_play = await search(args.join(" "))
    let img = await (await fetch(`${yt_play[0].image}`)).buffer()
    let txt = `\t\t\t*乂  Y O U T U B E  -  P L A Y*\n\n`
       txt += `*Titulo ∙* ${yt_play[0].title}\n`
       txt += `*Duración ∙* ${secondString(yt_play[0].duration.seconds)}\n`
       txt += `*Publicado ∙*  ${yt_play[0].ago}\n`
       txt += `*Url ∙* ${yt_play[0].url}\n\n`
       txt += `- Para descargar responde a este mensaje con *Video* o *Audio*.`
await conn.sendMessage(m.chat, {
text: txt,
contextInfo: { 
forwardingScore: 9999, 
isForwarded: true, 
externalAdReply: {
title: botname,
body: textbot,
thumbnailUrl: img,
thumbnail: img,
sourceUrl: canal,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
await m.react('✅')
} catch {
await m.reply(`${global.error}`)
}}
handler.command = ['test']
handler.limit = 1
export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}

function MilesNumber(number) {
  let exp = /(\d)(?=(\d{3})+(?!\d))/g;
  let rep = "$1.";
  let arr = number.toString().split(".");
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join(".") : arr[0];
}

function secondString(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? ":" : ":") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}*/