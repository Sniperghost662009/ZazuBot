import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, MessageRetryMap, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from "qrcode";
import crypto from 'crypto';
import fs from "fs";
import pino from 'pino';
import * as ws from 'ws';

const { CONNECTING } = ws;

import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (global.conns instanceof Array) console.log();
else global.conns = [];

async function handler(m, { conn: _conn, args, usedPrefix, command, isOwner }) {
    let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn;
    if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
        throw `Este comando solo puede ser usado en el bot principal\n\n wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`;
    }

    async function bbts() {
        let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8);

        if (!fs.existsSync("./jadibts/" + authFolderB)) {
            fs.mkdirSync("./jadibts/" + authFolderB, { recursive: true });
        }
        args[0] ? fs.writeFileSync("./jadibts/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";

        const { state, saveState, saveCreds } = await useMultiFileAuthState(`./jadibts/${authFolderB}`);
        const msgRetryCounterMap = (MessageRetryMap) => {};
        const msgRetryCounterCache = new NodeCache();
        const { version } = await fetchLatestBaileysVersion();
        let phoneNumber = m.sender.split('@')[0];

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
                let jid = jidNormalizedUser(clave.remoteJid);
                let msg = await store.loadMessage(jid, clave.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            msgRetryCounterMap,
            defaultQueryTimeoutMs: undefined,
            version
        };

        let conn = makeWASocket(connectionOptions);

        if (!conn.authState.creds.registered) {
            if (!phoneNumber) {
                console.error('El número de teléfono no está definido.');
                return;
            }
            let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
            if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
                console.error('El número debe comenzar con el código de país.');
                return;
            }

            try {
                let codeBot = await conn.requestPairingCode(cleanedNumber);
                codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;

                await m.reply(`*S E R B O T - C O D E 🌿*\n\n*Usa este Código para convertirte en Bot*\n\n1. Haga click en los tres puntos en la esquina superior derecha.\n2. Toque Dispositivos vinculados\n3. Selecciona *Vincular con el número de teléfono*\n\n*Nota:* El código solo sirve para este número\n\nCódigo: ${codeBot}`, null, {
                    contextInfo: {
                        buttons: [
                            { buttonId: 'copy_code', buttonText: { displayText: 'Copiar Código' }, type: 1 }
                        ]
                    }
                });
            } catch (error) {
                console.error('Error al solicitar el código de emparejamiento:', error);
                return;
            }
        }

        // Resto del código...
    }

    await bbts(); // Llamada a la función principal

    // Funciones adicionales del comando...
}

handler.help = ['ᴄᴏᴅᴇ'];
handler.tags = ['jadibot'];
handler.command = ['code2'];

export default handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
