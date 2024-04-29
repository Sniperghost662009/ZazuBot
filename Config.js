import { watchFile, unwatchFile } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import fs from "fs";
import cheerio from "cheerio";
import fetch from "node-fetch";
import axios from "axios";
import moment from "moment-timezone";

global.owner = [
  ['524922108173', 'Tryzer', true]
];

global.mods = [];
global.prems = [];

global.packname = 'Zazu Bot';
global.author = 'Snipe';
global.desc = 'IA que descarga videos, fotos, canciones y te ayuda con tu tarea'; // Descripción actualizada
global.namebot = 'Zazu Bot';
global.wait = '*Cargando. . .*';
global.gcname = 'Zazu Bot';
global.wm = 'Zazu Bot';

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

global.imgmenu = fs.readFileSync('./Menu.png');
global.ytlogo = fs.readFileSync('./Menu2.jpg');
global.miniurl = fs.readFileSync('./Menu3.png');
global.catalogo = fs.readFileSync('./storage/img/catalogo.png');
global.thumbnail = fs.readFileSync('./Menu.png');

global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "524922108173-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: 'Zazu Bot', orderTitle: 'YourOrderTitle', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}};

global.group = 'https://chat.whatsapp.com/YourGroupLink';

global.multiplier = 69;
global.maxwarn = '2';

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});
