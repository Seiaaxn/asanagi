require("./settings.js")
const fs = require('fs')
const axios = require('axios')
const chalk = require ("chalk")
const sharp = require('sharp')
const path = require('path')
const { prepareWAMessageMedia, generateWAMessageFromContent, proto } = require('@whiskeysocket/baileys')
const { spawn, exec } = require('child_process')
 const { catbox } = require('./lib/uploader');
const { runtime, getTime } = require('./lib/utils');
const stringWidth = require('string-width')
let afk = require('./lib/afk')
let _afk = JSON.parse(fs.readFileSync('./database/afk.json'))
const groupFile = './database/group.json'
let groupDB = fs.existsSync(groupFile) ? JSON.parse(fs.readFileSync(groupFile, 'utf-8')) : {}
const saveGroupDB = () => {
    fs.writeFileSync(groupFile, JSON.stringify(groupDB, null, 2))
}
module.exports = async (castorice, m) => {
    try {
const body = (m.mtype === 'conversation') ? m.message.conversation :
             (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text :
             (m.mtype === 'imageMessage') ? m.message.imageMessage.caption :
             (m.mtype === 'videoMessage') ? m.message.videoMessage.caption :
             (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
             (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
             (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
             (m.mtype === 'viewOnceMessageV2') ? (m.msg.interactiveResponseMessage ? JSON.parse(m.msg.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : m.msg.caption || m.msg.text || '') : '';
let budy = (typeof m.text == 'string' ? m.text : '')
const prefix = /^[./!#]/.test(body) ? body.match(/^[./!#]/)[0] : '';
const isCmd = body.startsWith(prefix) && prefix !== '';
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const text = q = args.join(" ") || (m.quoted ? (m.quoted.text || m.quoted.caption || "") : "");
const botNumber = castorice.decodeJid(castorice.user.id)
const isBot = m.sender === botNumber
const isGroup = m.key.remoteJid.endsWith('@g.us');
const sender = m.key.fromMe ? (castorice.user.id.split(':')[0] + '@s.whatsapp.net' || castorice.user.id) : (m.key.participant || m.key.remoteJid);
const groupMetadata = isGroup ? await castorice.groupMetadata(m.key.remoteJid).catch(e => {}) : '';
const groupName = isGroup ? groupMetadata.subject : '';
const participants = groupMetadata.participants || []
const groupAdmins = participants
    .filter(v => v.admin !== null)
    .map(v => v.jid)
const isAdmins = groupAdmins.includes(m.sender)
const isBotAdmins = groupAdmins.includes(castorice.decodeJid(castorice.user.id))
const isAuthor = [global.nomorauthor]
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(m.sender)

const isOwner = isAuthor || [global.nomorown]
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(m.sender)

const isCreator = isAuthor
let ppUrl = await castorice.profilePictureUrl(m.chat, 'image').catch(() => null)

if (!ppUrl || typeof ppUrl !== 'string') {
  ppUrl = await castorice.profilePictureUrl(m.sender, 'image').catch(() => null)
}

if (!ppUrl || typeof ppUrl !== 'string') {
  ppUrl = global.thumb.menu
}
const gambar = await axios.get(ppUrl, { responseType: 'arraybuffer' })
const bufbig = Buffer.from(gambar.data)
let smallBuffer = await sharp(bufbig).resize(200, 200).jpeg({ quality: 60 }).toBuffer()
    
            
const ftroli = {
    key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
    },
    message: {
        orderMessage: {
            itemCount: 2009,
            status: 'INQUIRY',
            surface: 'CATALOG',
            message: global.bot,
            orderTitle: 'AsanagiCodex',
            thumbnail: smallBuffer,
            sellerJid: '0@s.whatsapp.net',
            token: 'AR6x+767'
    }
}
}
const fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': owner, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${owner},;;;\nFN:${owner}\nitem1.TEL;waid=6281328139682:6281328139682\nitem1.X-ABLabel:Mobile\nEND:VCARD`, 'jpegThumbnail': thumb, thumbnail: thumb,sendEphemeral: true}}}

let rawMentions = m.msg?.contextInfo?.mentionedJid ? m.msg.contextInfo.mentionedJid : []

if (m.isGroup && rawMentions.length > 0) {
    let groupMetadata = await castorice.groupMetadata(m.chat)
    let participants = groupMetadata.participants

    m.mentionedJid = rawMentions.map(mention => {
        let found = participants.find(p => p.id === mention || p.lid === mention)

        return found ? found.jid : mention
    })
} else {
    m.mentionedJid = rawMentions
}
const reply = (text) => castorice.sendMessage(m.chat, { text }, { quoted: m });        
for (let name in global.plugins) {
    let plugin = global.plugins[name]
    if (plugin.onMessage) {
        await plugin.onMessage(castorice, m, { 
            body, 
            isOwner,
            isAuthor,
            budy, 
            prefix, 
            command,
            ftroli
        })
    }
}        
if (isCmd) {
            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (plugin.command && plugin.command.includes(command)) {
                    const isOwnerFolder = plugin.file && plugin.file.startsWith('owner/')
                    if (isOwnerFolder && !isAuthor) return reply(global.mess.owner)
                    return plugin.run(castorice, m, { text, args, prefix, reply, command, isAdmins, isOwner, isAuthor, isBotAdmins, ftroli, generateWAMessageFromContent, groupDB, participants, runtime, fkontak })
                }
            }
        }


const { time, date, day } = getTime()
const width = 60

let roleColor = isAuthor ? chalk.magentaBright : (isOwner ? chalk.redBright : (isAdmins ? chalk.yellowBright : chalk.blueBright))
let roleName = isAuthor ? 'AUTHOR' : (isOwner ? 'OWNER' : (isAdmins ? 'ADMIN' : 'USER'))

const lines = [
    ` ${chalk.cyan(day)}, ${chalk.cyan(date)} ${chalk.white('|')} ${chalk.cyan(time)}`,
    `divider`,
    ` ${chalk.white('[')} ${chalk.magentaBright('CMD')} ${chalk.white(']')} : ${chalk.greenBright(command)}`,
        ` ${chalk.white('[')} ${chalk.magentaBright('TXT')} ${chalk.white(']')} : ${chalk.greenBright(budy)}`,
    ` ${chalk.white('[')} ${chalk.yellowBright('FROM')} ${chalk.white(']')} : ${chalk.white(m.pushName || 'No Name')} ${chalk.gray('(' + m.sender.split('@')[0] + ')')}`,
    ` ${chalk.white('[')} ${chalk.blueBright('STAT')} ${chalk.white(']')} : ${m.isGroup ? chalk.magenta('GROUP') : chalk.cyan('PRIVATE')} ${chalk.white('|')} ${chalk.white('ROLE:')} ${roleColor(roleName)}`
]

console.log(chalk.white('┌' + '─'.repeat(width - 2) + '┐'))
lines.forEach(line => {
    if (line === 'divider') {
        console.log(chalk.white('├' + '─'.repeat(width - 2) + '┤'))
    } else {
        const visualWidth = stringWidth(line)
        const padding = width - visualWidth - 2
        console.log(chalk.white('│') + line + ' '.repeat(Math.max(0, padding)) + chalk.white('│'))
    }
})
console.log(chalk.white('└' + '─'.repeat(width - 2) + '┘'))

if (m.isGroup) {
    if (!groupDB[m.chat]) groupDB[m.chat] = {}

    const defaultFeatures = {
        akses: false,
        hidetag: false,
        tiktokdetector: false,
        onlyadmin: false,
        welcome: { enabled: false, text: "" },
        goodbye: { enabled: false, text: "" }
    }

    Object.keys(defaultFeatures).forEach(feature => {
        if (groupDB[m.chat][feature] === undefined) {
            groupDB[m.chat][feature] = defaultFeatures[feature]
        }
    })
}

function totalFitur(caseFilePath) {
    let totalPlugins = 0
    let totalCases = 0

    const pluginsPath = path.join(__dirname, './plugins_castorice')
    function countPluginFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) countPluginFiles(fullPath)
            else if (entry.isFile() && entry.name.endsWith('.js')) totalPlugins++
        }
    }
    if (fs.existsSync(pluginsPath)) countPluginFiles(pluginsPath)

    const absCase = path.isAbsolute(caseFilePath) ? caseFilePath : path.join(__dirname, caseFilePath)
    if (fs.existsSync(absCase)) {
        const fileContent = fs.readFileSync(absCase, 'utf8')
        const cases = fileContent.match(/\bcase\s+['"][^'"]+['"]\s*:/g)
        totalCases = cases ? cases.length : 0
    }

    return {
        plugins: totalPlugins,
        cases: totalCases,
        total: totalPlugins + totalCases
    }
}
        switch (command) {
            case 'totalfitur':
case 'fitur': {
    const stats = totalFitur('castoruce-handler.js')

    let teks = `*📊 STATISTIK FITUR*\n\n`
    teks += `🧩 *Plugins:* ${stats.plugins} file\n`
    teks += `📜 *Switch Cases:* ${stats.cases} fitur\n`
    teks += `✨ *Grand Total:* ${stats.total} fitur ready!\n\n`

    reply(teks)
}
break
case 'change': {
    if (!isOwner) return reply(global.mess.owner)
    if (!q) return reply(`*Pilih Tipe & Nilai Baru:*
• .change bot [nama]
• .change owner [nama]
• .change noown [nomor]
• .change nobot [nomor]
• .change thumbmenu [url]
• .change thumbreply [url]`)

    let type = q.split(' ')[0].toLowerCase()
    let value = q.split(' ').slice(1).join(' ')

    if (!value) return reply(`URL/Teks nya mana, Cok?`)

    let content = fs.readFileSync('./settings.js', 'utf8')
    let updatedContent;
    let targetName;

    switch (type) {
        case 'bot':
            updatedContent = content.replace(/global\.bot\s*=\s*".*?"/g, `global.bot = "${value}"`)
            targetName = "Nama Bot"
            break
        case 'owner':
            updatedContent = content.replace(/global\.owner\s*=\s*".*?"/g, `global.owner = "${value}"`)
            targetName = "Nama Owner"
            break
        case 'noown':
            let numOwn = value.replace(/[^0-9]/g, '')
            updatedContent = content.replace(/global\.nomorown\s*=\s*".*?"/g, `global.nomorown = "${numOwn}"`)
            targetName = "Nomor Owner"
            break
        case 'nobot':
            let numBot = value.replace(/[^0-9]/g, '')
            updatedContent = content.replace(/global\.nomorbor\s*=\s*".*?"/g, `global.nomorbor = "${numBot}"`)
            targetName = "Nomor Bot"
            break
        case 'thumbmenu':

            updatedContent = content.replace(/menu\s*:\s*".*?"/g, `menu: "${value}"`)
            targetName = "Thumbnail Menu"
            break
        case 'thumbreply':

            updatedContent = content.replace(/reply\s*:\s*".*?"/g, `reply: "${value}"`)
            targetName = "Thumbnail Reply"
            break
        default:
            return reply("Tipe tidak valid. Pilih: bot, owner, noown, nobot, thumbmenu, atau thumbreply.")
    }

    try {
        fs.writeFileSync('./settings.js', updatedContent)
        reply(`*BERHASIL!* ✅\n${targetName} diganti jadi:\n${value}`)
    } catch (err) {
        reply("Gagal edit file!")
    }
}
break
case 'ping': {
    const os = require('os');
    const { performance } = require('perf_hooks');
    const start = performance.now();
    const end = performance.now();
    const latensi = (end - start).toFixed(4);
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';
    const usedMemory = process.memoryUsage().rss;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    let txt = `*PONG!!* 🚀\n\n`;
    txt += `*─── [ BOT INFO ] ───*\n`;
    txt += `*⚡ Respon:* ${latensi} ms\n`;
    txt += `*⏳ Runtime:* ${runtime(process.uptime())}\n`;
    txt += `*📂 Node:* ${process.version}\n\n`;

    txt += `*─── [ SYSTEM INFO ] ───*\n`;
    txt += `*💻 OS:* ${os.platform()} (${os.release()})\n`;
    txt += `*🏗️ Arch:* ${os.arch()}\n`;
    txt += `*🦾 CPU:* ${cpus.length} Core(s) - ${cpuModel}\n`;
    txt += `*🧠 RAM:* ${(usedMemory / 1024 / 1024).toFixed(2)} MB / ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    txt += `*📉 Free:* ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n`;
    txt += `*🌡️ Uptime OS:* ${runtime(os.uptime())}\n\n`;

    txt += `*─── [ NETWORK ] ───*\n`;
    txt += `*🌐 Interface:* ${Object.keys(os.networkInterfaces())[0] || 'Unknown'}\n`;
    txt += `*📶 Load:* ${os.loadavg()[0].toFixed(2)}%`;

    reply(txt);
}
    break;
  
        }
    } catch (err) {
        console.error(err);
    }
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.black(chalk.bgGreen(' UPDATED ')), chalk.white(`Case baru di-load: ${__filename}`));
    delete require.cache[file];
    require(file);
});