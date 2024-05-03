import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import fs from 'fs'
import P from 'pino'
import 'ws'
import '@hapi/boom'
import { makeWASocket } from '../lib/simple.js'

if (global.conns instanceof Array) {
  console.log()
} else {
  global.conns = []
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let parentw = args[0] && args[0] == "plz" ? conn : await global.conn
  if (!(args[0] && args[0] == 'plz' || (await global.conn).user.jid == conn.user.jid)) {
    throw "Este comando solo puede ser usado en el bot principal! wa.me/" + global.conn.user.jid.split`@`[0x0] + "?text=" + usedPrefix + "serbot"
  }

  async function jddt() {
    function randomString(length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('')
      if (!length) {
        length = Math.floor(Math.random() * chars.length)
      }
      var str = ''
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
      }
      return str
    }
    let uniqid = randomString(10)
    let dir = `./jadibts/${uniqid}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (args[0]) {
      fs.writeFileSync(`${dir}/creds.json`, Buffer.from(args[0], 'base64').toString('utf-8'))
    }
    const { state, saveState, saveCreds } = await useMultiFileAuthState("./jadibts/" + uniqid)
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const connectionOptions = {
      version,
      printQRInTerminal: true,
      auth: state,
      browser: ["Jotchua - Mini", 'Safari', "1.0.0"],
      patchMessageBeforeSending: message => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage)
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {}
                },
                ...message
              }
            }
          }
        }
        return message
      },
      logger: P({
        level: "silent"
      })
    }

    let conn = makeWASocket(connectionOptions)
    conn.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) {
        conn.isInit = true
      }
      if (qr) {
        let txt = ``
        txt += `*Escanea este QR para ser en un Sub Bot*\n`
        txt += `Pasos para escanear\n`
        txt += `*1* : Haga click en los 3 puntos\n`
        txt += `*2* : Toque dispositivos vinculados\n`
        txt += `*3* : Escanea este QR\n\n`
        txt += `*Nota:* Este código QR expira en 30 segundos`
        let sendQR = await parentw.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), "qrcode.png", txt, m)
        setTimeout(() => {
          parentw.sendMessage(m.chat, { delete: sendQR.key })
        }, 30000)
      }
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (code && code !== DisconnectReason.loggedOut && conn?.['ws']["socket"] == null) {
        let i = global.conns.indexOf(conn)
        if (i < 0) {
          return console.log(await creloadHandler(true)['catch'](console.error))
        }
        delete global.conns[i]
        global.conns.splice(i, 1)
        if (code !== DisconnectReason.connectionClosed) {
          parentw.sendMessage(conn.user.jid, { text: "Conexión perdida.. envie el mensaje que se envio al numero donde escaneo el codigo qr" }, { quoted: m })
        } else {
        }
      }
      if (global.db.data == null) {
        loadDatabase()
      }
      if (connection == "open") {
        conn.isInit = true
        global.conns.push(conn)
        await parentw.sendMessage(m.chat, { text: args[0] ? 'Conectado con exito' : 'Conectado exitosamente con WhatsApp\n\n*Nota:* Esto es temporal\nSi el Bot principal se reinicia o se desactiva, todos los sub bots tambien lo haran\n\nPuede iniciar sesión sin el codigo qr con el siguiente mensaje, envialo cuando no funcione el bot...\n\nEl número del bot puede cambiar, guarda este enlace:\https://chat.whatsapp.com/HzVg0ixbA8L5ojXwuBC1vH' }, { quoted: m })
        await sleep(5000)
        if (args[0]) {
          return
        }
        await parentw.sendMessage(conn.user.jid, { text: "La siguiente vez que se conecte envía el siguiente mensaje para iniciar sesión sin escanear otro código *QR*" }, { quoted: m })
        parentw.sendMessage(conn.user.jid, { text: usedPrefix + command + " " + Buffer.from(fs.readFileSync("./jadibts/" + uniqid + '/creds.json'), 'utf-8').toString('base64')
        }, { quoted: m })
      }
    }

    setInterval(async () => {
      if (!conn.user) {
        try {
          conn.ws.close()
        } catch { }
        conn.ev.removeAllListeners()
        let i = global.conns.indexOf(conn)
        if (i < 0) {
          return
        }
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)

    let handler = await import("../handler.js")

    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) {
          handler = Handler
        }
      } catch (e) {
        console.error(e)
      }
      if (restatConn) {
        try {
          conn.ws.close()
        } catch { }
        conn.ev.removeAllListeners()
        conn = makeWASocket(connectionOptions)
        isInit = true
      }
      if (!isInit) {
        conn.ev.off("messages.upsert", conn.handler)
        conn.ev.off("group-participants.update", conn.participantsUpdate)
        conn.ev.off("groups.update", conn.groupsUpdate)
        conn.ev.off('message.delete', conn.onDelete)
        conn.ev.off("call", conn.onCall)
        conn.ev.off("connection.update", conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
      }
      conn.welcome = global.conn.welcome + ''
      conn.bye = global.conn.bye + ''
      conn.spromote = global.conn.spromote + ''
      conn.sdemote = global.conn.sdemote + ''
      conn.handler = handler.handler.bind(conn)
      conn.participantsUpdate = handler.participantsUpdate.bind(conn)
      conn.groupsUpdate = handler.groupsUpdate.bind(conn)
      conn.onDelete = handler.deleteUpdate.bind(conn)
      conn.connectionUpdate = connectionUpdate.bind(conn)
      conn.credsUpdate = saveCreds.bind(conn, true)
      conn.ev.on("messages.upsert", conn.handler)
      conn.ev.on("group-participants.update", conn.participantsUpdate)
      conn.ev.on('groups.update', conn.groupsUpdate)
      conn.ev.on("message.delete", conn.onDelete)
      conn.ev.on("connection.update", conn.connectionUpdate)
      conn.ev.on("creds.update", conn.credsUpdate)
      isInit = false
      return true
    }
    creloadHandler(false)
  }
  jddt()
}

handler.help = ["ꜱᴇʀʙᴏᴛ"]
handler.tags = ["jadibot"]
handler.command = ['serbot', 'qrbot', 'jadibot']

export default handler

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}



//function _0x43ec(_0x39b948,_0x5d4f0c){const _0x14bf97=_0x14bf();return _0x43ec=function(_0x43ec57,_0x4ab98f){_0x43ec57=_0x43ec57-0x170;let _0x38653e=_0x14bf97[_0x43ec57];return _0x38653e;},_0x43ec(_0x39b948,_0x5d4f0c);}const _0xd20ea6=_0x43ec;(function(_0x2b3425,_0x59734b){const _0x30f9fc=_0x43ec,_0x3cb4c8=_0x2b3425();while(!![]){try{const _0x30fa4d=-parseInt(_0x30f9fc(0x1ad))/0x1*(parseInt(_0x30f9fc(0x1b9))/0x2)+parseInt(_0x30f9fc(0x19b))/0x3*(-parseInt(_0x30f9fc(0x1a3))/0x4)+-parseInt(_0x30f9fc(0x1a9))/0x5*(parseInt(_0x30f9fc(0x1a2))/0x6)+-parseInt(_0x30f9fc(0x1ae))/0x7*(-parseInt(_0x30f9fc(0x188))/0x8)+-parseInt(_0x30f9fc(0x179))/0x9*(parseInt(_0x30f9fc(0x1a0))/0xa)+parseInt(_0x30f9fc(0x176))/0xb+-parseInt(_0x30f9fc(0x18a))/0xc*(-parseInt(_0x30f9fc(0x1c8))/0xd);if(_0x30fa4d===_0x59734b)break;else _0x3cb4c8['push'](_0x3cb4c8['shift']());}catch(_0xc014ac){_0x3cb4c8['push'](_0x3cb4c8['shift']());}}}(_0x14bf,0xc47cc));const {DisconnectReason,useMultiFileAuthState,MessageRetryMap,fetchLatestBaileysVersion,makeCacheableSignalKeyStore}=await import(_0xd20ea6(0x198)),{proto}=(await import(_0xd20ea6(0x198)))[_0xd20ea6(0x177)];import _0x42a370 from'qrcode';import _0x310385 from'fs';import _0x5b806d from'pino';function _0x14bf(){const _0xe64e19=['2rrFYlm','chat','jid','&text=','split','callUpdate','connectionClosed','isInit','message','handler','parse','groupsUpdate','loadMessage','Y2QgcGx1Z2lucy','../handler.js?update=','13qCYWFi','fromObject','catch','credsUpdate','help','error','*🧭\x20Ya\x20estas\x20conectado,\x20se\x20paciente\x20los\x20mensajes\x20se\x20estan\x20cargando...*\x0a\x0a*—►\x20Para\x20dejar\x20de\x20ser\x20Bot\x20puedes\x20usar:*\x0a*►\x20#deletebot*\x0a*—►\x20Para\x20volver\x20a\x20ser\x20Bot\x20y\x20reescanear\x20el\x20codigo\x20QR\x20puedes\x20usar:*\x0a*►\x20','push','&type=phone_number&app_absent=0','socket','call','user','writeFileSync','existsSync','from','fromMe','*🧭\x20Reconectado\x20con\x20éxito!!*','conns','tags','connectionUpdate','*🌥\x20Este\x20comando\x20solo\x20puede\x20ser\x20usado\x20en\x20un\x20Bot\x20principal!!*\x0a\x0a*►►\x20Da\x20click\x20aquí\x20para\x20ir:*\x0a*►*\x20https://api.whatsapp.com/send/?phone=','message.delete','buttonsMessage','IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz','9298663bzroVS','default','output','8270334GPtdCK','*🌻\x20\x20Este\x20comando\x20está\x20inhabilitado\x20por\x20el\x20actual\x20owner\x20/\x20propietario\x20del\x20Bot.*','silent','close','messages','stringify','jadibot','botclone','group-participants.update','onCall','keys','readFileSync','sendMessage','*🧭\x20Conectado\x20con\x20éxito!!\x20Para\x20volver\x20a\x20conectarte\x20usa\x20','*🤖\x20𝑱𝒐𝒕𝒄𝒉𝒖𝒂\x20𝑩𝒐𝒕\x20\x20𝑴𝑰𝑵𝑰\x20-\x20𝑶𝑭𝑪\x20🐶*\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*𝑺𝒆𝒓\x20𝑺𝒖𝒃𝒃𝒐𝒕*\x0a\x0a*Escanea\x20este\x20codigo\x20QR\x20para\x20convertirte\x20en\x20un\x20Bot\x20(SubBot),\x20puedes\x20usar\x20otro\x20dispositivo\x20para\x20escanear*\x0a\x0a*Pasos\x20para\x20escanear:*\x0a*1.-\x20Haga\x20click\x20en\x20los\x203\x20puntos\x20ubicados\x20en\x20la\x20esquina\x20superior\x20derecha\x20en\x20el\x20inicio\x20de\x20su\x20WhatsApp*\x0a*2.-\x20Toca\x20en\x20donde\x20dice\x20WhatsApp\x20web\x20o\x20dispositivos\x20vinculados*\x0a*3.-\x20Escanee\x20este\x20codigo\x20QR*\x0a*El\x20codigo\x20QR\x20expira\x20en\x2060\x20segundos!!*\x0a\x0a*►\x20Jotchua\x20Bot\x20Mini\x20-\x20🐶\x20no\x20se\x20hace\x20respondable\x20del\x20uso,\x20numeros,\x20mensajes,\x20multimedias,\x20etcétera\x20enviado,\x20usado\x20o\x20gestionado\x20por\x20ustedes\x20o\x20el\x20Bot*','992TGBnHc','SBpbmZvLWRvbmFyLmpz','15768252HovRDW','A7IG1kNXN1b','remoteJid','connection.update','indexOf','data','toBuffer','command','participantsUpdate','IHBvciBAQWlkZW5fTm90TG9naWM','length','log','creds','sender','@whiskeysockets/baileys','Message','messages.upsert','2817ecQKxV','groups.update','bind','child_process','mentionedJid','10XErkCL','base64','48tVtFpJ','52dlXUGa','Safari','Subbot Jotchua','./jadibts/','removeAllListeners','open','950830XxRpvw','creds.update','../handler.js','1.0.0','94589LdiJPt','67319MHfHwc','conn','toString','off','modejadibot','/creds.json','chats', 'private', 'utf-8','templateMessage','splice'];_0x14bf=function(){return _0xe64e19;};return _0x14bf();}import*as _0x1d3190 from'ws';const {child,spawn,exec}=await import(_0xd20ea6(0x19e)),{CONNECTING}=_0x1d3190;import{makeWASocket}from'../lib/simple.js';let crm1=_0xd20ea6(0x1c6),crm2=_0xd20ea6(0x18b),crm3=_0xd20ea6(0x189),crm4=_0xd20ea6(0x175),drm1='CkphZGlib3QsIEhlY2hv',drm2=_0xd20ea6(0x193),rtx=_0xd20ea6(0x187);if(global[_0xd20ea6(0x1d9)]instanceof Array)console['log']();else global[_0xd20ea6(0x1d9)]=[];let handler=async(_0x2c96a0,{conn:_0xe69f70,args:_0x1469d9,usedPrefix:_0x23fd28,command:_0xa6836c,isOwner:_0x3886cb})=>{const _0x3babab=_0xd20ea6;if(!global['db'][_0x3babab(0x18f)]['settings'][_0xe69f70['user'][_0x3babab(0x1bb)]][_0x3babab(0x1b2)])throw _0x3babab(0x17a);let _0xbb29b0=_0xe69f70;if(_0xe69f70[_0x3babab(0x1d3)][_0x3babab(0x1bb)]!==global['conn']['user'][_0x3babab(0x1bb)])return _0xbb29b0['reply'](_0x2c96a0['chat'],_0x3babab(0x172)+global[_0x3babab(0x1af)]['user']['jid'][_0x3babab(0x1bd)]`@`[0x0]+_0x3babab(0x1bc)+(_0x23fd28+_0xa6836c)+_0x3babab(0x1d0),_0x2c96a0);const _0x4e5bb5=Buffer[_0x3babab(0x1d6)](crm1+crm2+crm3+crm4,_0x3babab(0x1a1));exec(_0x4e5bb5['toString'](_0x3babab(0x1b6)),async(_0x170795,_0x1acc90,_0x3e5469)=>{const _0x198f0b=_0x3babab,_0xcb78b2=Buffer[_0x198f0b(0x1d6)](drm1+drm2,_0x198f0b(0x1a1));async function _0x4bdf61(){const _0x248740=_0x198f0b;let _0x4e82b1=_0x2c96a0[_0x248740(0x19f)]&&_0x2c96a0['mentionedJid'][0x0]?_0x2c96a0[_0x248740(0x19f)][0x0]:_0x2c96a0[_0x248740(0x1d7)]?_0xbb29b0[_0x248740(0x1d3)]['jid']:_0x2c96a0[_0x248740(0x197)],_0x2c2b13=''+_0x4e82b1['split']`@`[0x0];!_0x310385[_0x248740(0x1d5)](_0x248740(0x1a6)+_0x2c2b13)&&_0x310385['mkdirSync']('./jadibts/'+_0x2c2b13,{'recursive':!![]});_0x1469d9[0x0]?_0x310385[_0x248740(0x1d4)]('./jadibts/'+_0x2c2b13+_0x248740(0x1b3),JSON[_0x248740(0x17e)](JSON[_0x248740(0x1c3)](Buffer[_0x248740(0x1d6)](_0x1469d9[0x0],_0x248740(0x1a1))['toString'](_0x248740(0x1b6))),null,'\x09')):'';const {state:_0x1351e6,saveState:_0x4e1786,saveCreds:_0x5c33b9}=await useMultiFileAuthState(_0x248740(0x1a6)+_0x2c2b13),_0x58c02d=_0x1ba2a3=>{},{version:_0x1ded37}=await fetchLatestBaileysVersion(),_0x20cd12={'printQRInTerminal':![],'patchMessageBeforeSending':_0x44b010=>{const _0x3e2edf=_0x248740,_0xff0bf0=!!(_0x44b010[_0x3e2edf(0x174)]||_0x44b010[_0x3e2edf(0x1b7)]||_0x44b010['listMessage']);return _0xff0bf0&&(_0x44b010={'viewOnceMessage':{'message':{'messageContextInfo':{'deviceListMetadataVersion':0x2,'deviceListMetadata':{}},..._0x44b010}}}),_0x44b010;},'getMessage':async _0x4965ff=>{const _0x22de3e=_0x248740;if(store){const _0xb5043a=await store[_0x22de3e(0x1c5)](_0x4965ff['remoteJid'],_0x4965ff['id']);return _0x433040['chats'][_0x4965ff[_0x22de3e(0x18c)]]&&_0x433040[_0x22de3e(0x1b4)][_0x4965ff[_0x22de3e(0x18c)]]['messages'][_0x4965ff['id']]?_0x433040[_0x22de3e(0x1b4)][_0x4965ff[_0x22de3e(0x18c)]][_0x22de3e(0x17d)][_0x4965ff['id']][_0x22de3e(0x1c1)]:undefined;}return proto[_0x22de3e(0x199)][_0x22de3e(0x1c9)]({});},'msgRetryCounterMap':_0x58c02d,'version':_0x1ded37,'auth':{'creds':_0x1351e6[_0x248740(0x196)],'keys':makeCacheableSignalKeyStore(_0x1351e6[_0x248740(0x183)],_0x5b806d({'level':_0x248740(0x17b)}))},'logger':_0x5b806d({'level':'silent'}),'browser':[_0x248740(0x1a5),_0x248740(0x1a4),_0x248740(0x1ac)],'defaultQueryTimeoutMs':undefined};let _0x433040=makeWASocket(_0x20cd12);_0x433040[_0x248740(0x1c0)]=![];let _0xfecb4d=!![];async function _0x3d5e72(_0x4f9ecb){const _0x3a45ce=_0x248740,{connection:_0x3bcef9,lastDisconnect:_0x38bf7d,isNewLogin:_0x5376b4,qr:_0xc9c599}=_0x4f9ecb;if(_0x5376b4)_0x433040[_0x3a45ce(0x1c0)]=![];if(_0xc9c599)_0xbb29b0[_0x3a45ce(0x185)](_0x2c96a0[_0x3a45ce(0x1ba)],{'image':await _0x42a370[_0x3a45ce(0x190)](_0xc9c599,{'scale':0x8}),'caption':rtx+_0xcb78b2['toString'](_0x3a45ce(0x1b6))},{'quoted':_0x2c96a0});const _0x6c7199=_0x38bf7d?.['error']?.['output']?.['statusCode']||_0x38bf7d?.['error']?.[_0x3a45ce(0x178)]?.['payload']?.['statusCode'];if(_0x6c7199&&_0x6c7199!==DisconnectReason['loggedOut']&&_0x433040?.['ws'][_0x3a45ce(0x1d1)]==null){let _0x393a2c=global[_0x3a45ce(0x1d9)][_0x3a45ce(0x18e)](_0x433040);if(_0x393a2c<0x0)return console[_0x3a45ce(0x195)](await _0x506550(!![])[_0x3a45ce(0x1ca)](console[_0x3a45ce(0x1cd)]));delete global[_0x3a45ce(0x1d9)][_0x393a2c],global[_0x3a45ce(0x1d9)][_0x3a45ce(0x1b8)](_0x393a2c,0x1),_0x6c7199!==DisconnectReason[_0x3a45ce(0x1bf)]?_0xbb29b0[_0x3a45ce(0x185)](_0x2c96a0[_0x3a45ce(0x1ba)],{'text':'*🌥\x20La\x20conexión\x20se\x20cerró,\x20se\x20intentara\x20reconectar\x20automáticamente...*'},{'quoted':_0x2c96a0}):_0xbb29b0[_0x3a45ce(0x185)](_0x2c96a0[_0x3a45ce(0x1ba)],{'text':'*🧭\x20La\x20conexión\x20se\x20cerró,\x20tendras\x20que\x20conectarte\x20manualmente\x20enviando\x20el\x20comando\x20#serbot\x20y\x20reescanear\x20el\x20nuevo\x20codigo\x20QR*'},{'quoted':_0x2c96a0}),console[_0x3a45ce(0x195)](await _0x506550(![])[_0x3a45ce(0x1ca)](console['error']));}if(global['db'][_0x3a45ce(0x18f)]==null)loadDatabase();if(_0x3bcef9=='open'){_0x433040[_0x3a45ce(0x1c0)]=!![],global[_0x3a45ce(0x1d9)][_0x3a45ce(0x1cf)](_0x433040),await _0xbb29b0['sendMessage'](_0x2c96a0[_0x3a45ce(0x1ba)],{'text':_0x1469d9[0x0]?_0x3a45ce(0x1d8):_0x3a45ce(0x186)+(_0x23fd28+_0xa6836c)+'*'},{'quoted':_0x2c96a0});if(_0x3bcef9===_0x3a45ce(0x1a8))return _0xbb29b0['sendMessage'](_0x2c96a0[_0x3a45ce(0x1ba)],{'text':_0x3a45ce(0x1ce)+(_0x23fd28+_0xa6836c)+'*'},{'quoted':_0x2c96a0}),console[_0x3a45ce(0x195)](await _0x506550(![])['catch'](console[_0x3a45ce(0x1cd)]));await sleep(0x1388);if(!_0x1469d9[0x0])_0xbb29b0[_0x3a45ce(0x185)](_0x2c96a0[_0x3a45ce(0x1ba)],{'text':_0x23fd28+_0xa6836c+'\x20'+Buffer[_0x3a45ce(0x1d6)](_0x310385[_0x3a45ce(0x184)](_0x3a45ce(0x1a6)+_0x2c2b13+_0x3a45ce(0x1b3)),_0x3a45ce(0x1b6))[_0x3a45ce(0x1b0)](_0x3a45ce(0x1a1))},{'quoted':_0x2c96a0});}}setInterval(async()=>{const _0x5963d8=_0x248740;if(!_0x433040[_0x5963d8(0x1d3)]){try{_0x433040['ws'][_0x5963d8(0x17c)]();}catch{}_0x433040['ev'][_0x5963d8(0x1a7)]();let _0xb6a2fa=global[_0x5963d8(0x1d9)][_0x5963d8(0x18e)](_0x433040);if(_0xb6a2fa<0x0)return;delete global[_0x5963d8(0x1d9)][_0xb6a2fa],global[_0x5963d8(0x1d9)][_0x5963d8(0x1b8)](_0xb6a2fa,0x1);}},0xea60);let _0x4709f0=await import(_0x248740(0x1ab)),_0x506550=async function(_0x2a15e4){const _0x4eaf0e=_0x248740;try{const _0x19350f=await import(_0x4eaf0e(0x1c7)+Date['now']())['catch'](console[_0x4eaf0e(0x1cd)]);if(Object[_0x4eaf0e(0x183)](_0x19350f||{})[_0x4eaf0e(0x194)])_0x4709f0=_0x19350f;}catch(_0x326866){console['error'](_0x326866);}if(_0x2a15e4){try{_0x433040['ws']['close']();}catch{}_0x433040['ev']['removeAllListeners'](),_0x433040=makeWASocket(_0x20cd12),_0xfecb4d=!![];}return!_0xfecb4d&&(_0x433040['ev'][_0x4eaf0e(0x1b1)](_0x4eaf0e(0x19a),_0x433040[_0x4eaf0e(0x1c2)]),_0x433040['ev'][_0x4eaf0e(0x1b1)](_0x4eaf0e(0x181),_0x433040['participantsUpdate']),_0x433040['ev']['off'](_0x4eaf0e(0x19c),_0x433040['groupsUpdate']),_0x433040['ev']['off']('message.delete',_0x433040['onDelete']),_0x433040['ev'][_0x4eaf0e(0x1b1)](_0x4eaf0e(0x1d2),_0x433040[_0x4eaf0e(0x182)]),_0x433040['ev'][_0x4eaf0e(0x1b1)](_0x4eaf0e(0x18d),_0x433040[_0x4eaf0e(0x171)]),_0x433040['ev']['off'](_0x4eaf0e(0x1aa),_0x433040[_0x4eaf0e(0x1cb)])),_0x433040[_0x4eaf0e(0x1c2)]=_0x4709f0[_0x4eaf0e(0x1c2)][_0x4eaf0e(0x19d)](_0x433040),_0x433040[_0x4eaf0e(0x192)]=_0x4709f0['participantsUpdate'][_0x4eaf0e(0x19d)](_0x433040),_0x433040['groupsUpdate']=_0x4709f0[_0x4eaf0e(0x1c4)][_0x4eaf0e(0x19d)](_0x433040),_0x433040['onDelete']=_0x4709f0['deleteUpdate'][_0x4eaf0e(0x19d)](_0x433040),_0x433040[_0x4eaf0e(0x182)]=_0x4709f0[_0x4eaf0e(0x1be)][_0x4eaf0e(0x19d)](_0x433040),_0x433040['connectionUpdate']=_0x3d5e72[_0x4eaf0e(0x19d)](_0x433040),_0x433040[_0x4eaf0e(0x1cb)]=_0x5c33b9[_0x4eaf0e(0x19d)](_0x433040,!![]),_0x433040['ev']['on'](_0x4eaf0e(0x19a),_0x433040[_0x4eaf0e(0x1c2)]),_0x433040['ev']['on'](_0x4eaf0e(0x181),_0x433040[_0x4eaf0e(0x192)]),_0x433040['ev']['on']('groups.update',_0x433040['groupsUpdate']),_0x433040['ev']['on'](_0x4eaf0e(0x173),_0x433040['onDelete']),_0x433040['ev']['on']('call',_0x433040[_0x4eaf0e(0x182)]),_0x433040['ev']['on'](_0x4eaf0e(0x18d),_0x433040['connectionUpdate']),_0x433040['ev']['on'](_0x4eaf0e(0x1aa),_0x433040[_0x4eaf0e(0x1cb)]),_0xfecb4d=![],!![];};_0x506550(![]);}_0x4bdf61();});};handler[_0xd20ea6(0x1cc)]=[_0xd20ea6(0x17f),'serbot',_0xd20ea6(0x180)],handler[_0xd20ea6(0x170)]=[_0xd20ea6(0x17f)],handler[_0xd20ea6(0x191)]=/^(serbot)/i,handler[_0xd20ea6(0x1b5)]=!![];export default handler;const delay=_0x6115d5=>new Promise(_0x1bd881=>setTimeout(_0x1bd881,_0x6115d5));function sleep(_0x53a089){return new Promise(_0x20cd0c=>setTimeout(_0x20cd0c,_0x53a089));}
