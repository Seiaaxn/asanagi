/* 
========================================
   Asanagi Umi © 2025-2026 
   Dilarang menghapus Creadit 
   Shyxn - Hak cipta di lindungi
========================================
*/

const fs = require("fs")
const chalk = require("chalk")

// Settingan Bot
global.owner = "Shyxn"
global.bot = "Asanagi Umi"
global.nomorown = "6285863756942"   // Nomor Owner
global.nomorbor = "6285184964505"
global.nomorauthor = "6285863756942" // Nomor Author
global.version = "2.0"

// Set thumbnail Bot
global.thumb = {
 menu: "https://files.catbox.moe/oxwle5.jpg",
}

// Set Message 
global.mess = {
 owner: "mouu!!!, kono komando wa kaeru dake ga tsukaemasu",
 admin: "ara? anata wa admin desu ka?",
 gc: "kore wa guruupu sen'you desu"
}

// Hot Realod Jangan di hapus
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.black(chalk.bgYellow(' UPDATED ')), chalk.white(`Setting baru di-load: ${__filename}`));
    delete require.cache[file];
    require(file);
});
