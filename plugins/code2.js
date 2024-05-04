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

        let conn = makeWASocket(connectionOptions)

        if (methodCode && !conn.authState.creds.registered) {
            // Resto del código...
        }

        conn.isInit = false

        let isInit = true

        async function connectionUpdate(update) {
            // Resto del código...
        }

        setInterval(async () => {
            // Resto del código...
        }, 60000)

        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            // Resto del código...
        }

        bbts()
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

