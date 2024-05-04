const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    MessageRetryMap,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    PHONENUMBER_MCC
} = await import('@whiskeysockets/baileys')
import moment from 'moment-timezone'
import NodeCache from 'node-cache'
import readline from 'readline'
import qrcode from "qrcode"
import crypto from 'crypto'
import fs from "fs"
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws
import { Boom } from '@hapi/boom'
import { makeWASocket } from '../lib/simple.js';

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {

    let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn
    if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
        throw `Este comando solo puede ser usado en el bot principal\n\n wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`
    }

    async function bbts() {
        let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8)

        if (!fs.existsSync("./jadibts/" + authFolderB)) {
            fs.mkdirSync("./jadibts/" + authFolderB, { recursive: true });
        }
        args[0] ? fs.writeFileSync("./jadibts/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""

        const { state, saveState, saveCreds } = await useMultiFileAuthState(`./jadibts/${authFolderB}`)
        const msgRetryCounterCache = new NodeCache()
        const { version } = await fetchLatestBaileysVersion();
        let phoneNumber = m.sender.split('@')[0]

        const MethodMobile = process.argv.includes("mobile")

        const connectionOptions = {
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            mobile: MethodMobile,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (clave) => {
                let jid = jidNormalizedUser(clave.remoteJid)
                let msg = await store.loadMessage(jid, clave.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
            version
      }
// Define methodCode aquí
let phoneNumber = m.sender.split('@')[0]
const methodCode = !!phoneNumber || process.argv.includes("code")

// Llama a la función bbts() después de definir methodCode
bbts();
  let conn = makeWASocket(connectionOptions)

        if (methodCode && !conn.authState.creds.registered) {
            if (!phoneNumber) {
                process.exit(0);
            }
            let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
            if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
                process.exit(0);
            }

            setTimeout(async () => {
                let codeBot = await conn.requestPairingCode(cleanedNumber);
                codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
                await m.reply(`*S E R B O T - C O D E 🌿*\n\n*Usa este Código para convertirte en Bot*\n\n1. Haga click en los tres puntos en la esquina superior derecha.\n2. Toque Dispositivos vinculados\n3. Selecciona *Vincular con el número de teléfono*\n\n*Nota:* El código solo sirve para este número`)

                conn.relayMessage(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: { text: 'Aquí está tu código:' },
                                footer: { text: 'Presiona el botón para copiar' },
                                nativeFlowMessage: {
                                    buttons: [
                                        {
                                            name: 'cta_copy',
                                            buttonParamsJson: JSON.stringify({
                                                display_text: 'Copiar código',
                                                copy_code: codeBot,
                                                id: 'copy_button'
                                            })
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }, {});
                rl.close();
            }, 3000);
        }

        conn.isInit = false

        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            if (isNewLogin) conn.isInit = true

            const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
                let i = global.conns.indexOf(conn)
                if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
                delete global.conns[i]
                global.conns.splice(i, 1)

                if (code !== DisconnectReason.connectionClosed) {
                    parent.sendMessage(conn.user.jid, { text: `⚠️ Conexión perdida...` }, { quoted: m })
                } else {
                    parent.sendMessage(m.chat, { text: `⛔ La conexión se cerró, Tendras que conectarte manualmente enviando el *ID*` }, { quoted: m })
                }
            }

            if (global.db.data == null) loadDatabase()

            if (connection == 'open') {
                conn.isInit = true
                global.conns.push(conn)
                await parent.sendMessage(m.chat, { text: args[0] ? `✅ conectado exitosamente` : `✅ *Conectado con éxito!*\n\nEn unos segundos te mandaremos el *Id* que debes usar para volver a conectarte\n\nEl número del bot puede cambiar, guarda este enlace:\https://chat.whatsapp.com/HzVg0ixbA8L5ojXwuBC1vH` }, { quoted: m })
                await sleep(5000)
                if (args[0]) return
                await parent.sendMessage(conn.user.jid, { text: `✅ La siguiente vez que se conecte envía el siguiente mensaje para iniciar sesión sin escanear otro código *QR*` }, { quoted: m })
                parent.sendMessage(conn.user.jid, { text: usedPrefix + command + " " + Buffer.from(fs.readFileSync("./jadibts/" + authFolderB + "/creds.json"), "utf-8").toString("base64") }, { quoted: m })
            }
        }

        setInterval(async () => {
            if (!conn.user) {
                try { conn.ws.close() } catch { }
                conn.ev.removeAllListeners()
                let i = global.conns.indexOf(conn)
                if (i < 0) return
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)


        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) {
                console.error(e)
            }
            if (restatConn) {
                try { conn.ws.close() } catch { }
                conn.ev.removeAllListeners()
                conn = makeWASocket(connectionOptions)
                isInit = true
            }

            if (!isInit) {
                conn.ev.off('messages.upsert', conn.handler)
                conn.ev.off('group-participants.update', conn.participantsUpdate)
                conn.ev.off('groups.update', conn.groupsUpdate)
                conn.ev.off('message.delete', conn.onDelete)
                conn.ev.off('call', conn.onCall)
                conn.ev.off('connection.update', conn.connectionUpdate)
                conn.ev.off('creds.update', conn.credsUpdate)
            }
async function bbts() {
    let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8)

    // Definir phoneNumber antes de methodCode
    let phoneNumber = m.sender.split('@')[0]
    const methodCode = !!phoneNumber || process.argv.includes("code")

    // Resto del código...

    const methodCodeQR = process.argv.includes("qr")
    const MethodMobile = process.argv.includes("mobile")

    // Resto del código...
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

            conn.ev.on('messages.upsert', conn.handler)
            conn.ev.on('group-participants.update', conn.participantsUpdate)
            conn.ev.on('groups.update', conn.groupsUpdate)
            conn.ev.on('message.delete', conn.onDelete)
            conn.ev.on('connection.update', conn.connectionUpdate)
            conn.ev.on('creds.update', conn.credsUpdate)
            isInit = false
            return true
        }
        creloadHandler(false)
    }
    bbts()
}
handler.help = ['ᴄᴏᴅᴇ']
handler.tags = ['jadibot']
handler.command = ['code2']
//handler.rowner = false

export default handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
