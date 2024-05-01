let cooldowns = {}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let poin = 300
    
    let tiempoEspera = 15
	    
	    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    m.reply(`*Miku Bot - MD* | 「 *PPT* 」\n\nYa has iniciado una apuesta recientemente, espera *${tiempoRestante}* para apostar nuevamente`)
    return
  }
  
  cooldowns[m.sender] = Date.now()
 
    let reseqv = `*• Seleccione piedra/papel/tijera*\n\n*Ejemplo:*\n*${usedPrefix + command}* papel`
    if (!text) throw reseqv
    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'piedra'
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'tijera'
    } else {
        astro = 'papel'
    }


    if (text == astro) {
      global.db.data.users[m.sender].exp += 100
        m.reply(`▢ *Empate*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos (±)100 XP`)
    } else if (text == 'piedra') {
        if (astro == 'tijera') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n Puntos *-${poin} XP*`)
        }
    } else if (text == 'tijera') {
        if (astro == 'papel') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\nPuntos *-${poin} XP*`)
        }
    } else if (text == 'papel') {
        if (astro == 'piedra') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku: ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\nPuntos *-${poin} XP*`)
        }
    } else {
        throw reseqv
    }
}
handler.help = ['ppt']
handler.tags = ['game']
handler.command = ['ppt'] 
handler.register = false

export default handler

function segundosAHMS(segundos) {
  let segundosRestantes = segundos % 60
  return `${segundosRestantes} segundos`
}

//import db from '../lib/database.js'

/*let handler = async (m, { conn, text, usedPrefix, command }) => {
    let poin = 300
    let time = global.db.data.users[m.sender].lastcas + 15000
  if (new Date - global.db.data.users[m.sender].lastcas < 15000) throw `Espera *${msToTime(time - new Date())}* para regresar a jugar`
  global.db.data.users[m.sender].lastcas = new Date * 1
    let reseqv = `*• Seleccione piedra/papel/tijera*\n\n*Ejemplo:*\n*${usedPrefix + command}* papel`
    if (!text) throw reseqv
    var astro = Math.random()

    if (astro < 0.34) {
        astro = 'piedra'
    } else if (astro > 0.34 && astro < 0.67) {
        astro = 'tijera'
    } else {
        astro = 'papel'
    }


    if (text == astro) {
      global.db.data.users[m.sender].exp += 100
        m.reply(`▢ *Empate*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos (±)100 XP`)
    } else if (text == 'piedra') {
        if (astro == 'tijera') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n Puntos *-${poin} XP*`)
        }
    } else if (text == 'tijera') {
        if (astro == 'papel') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\nPuntos *-${poin} XP*`)
        }
    } else if (text == 'papel') {
        if (astro == 'piedra') {
            global.db.data.users[m.sender].exp += 300
            m.reply(`▢ *Ganaste* 🎊\n\n‣ Tú : ${text}\n‣ Miku: ${astro}\n\n🎁 Puntos *+${poin} XP*`)
        } else {
          global.db.data.users[m.sender].exp -= 300
            m.reply(`▢ *Perdiste*\n\n‣ Tú : ${text}\n‣ Miku : ${astro}\n\nPuntos *-${poin} XP*`)
        }
    } else {
        throw reseqv
    }
}
handler.help = ['ppt']
handler.tags = ['game']
handler.command = ['ppt'] 
handler.register = false

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  seconds = (seconds < 10) ? "0" + seconds : seconds

  return seconds + " segundo(s)" 
}*/