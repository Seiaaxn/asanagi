/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const axios = require('axios');

module.exports = {
    name: 'YouTube Video Downloader',
    command: ['ytmp4', 'ytv', 'ytvideo'],
    category: 'download',
    run: async (castorice, m, { text, prefix, command }) => {
        if (!text) return m.reply(`Mana link YouTube-nya?\nContoh: ${prefix + command} https://youtu.be/xxxx`)
        
        // Validasi link youtube sederhana
        if (!/youtu.be|youtube.com/.test(text)) return m.reply('Link YouTube tidak valid!')

        m.reply('Tunggu bentar...')

        try {
            const response = await axios.get(`https://www.sankavolereii.my.id/download/ytmp4?apikey=planaai&url=${encodeURIComponent(text)}`)
            
            if (!response.data.status) return m.reply(`❌ Gagal: Data tidak ditemukan.`)

            const res = response.data.result
            const meta = res.metadata

            const caption = `
୧✿ 𝗝𝘂𝗱𝘂𝗹: ${res.title}
୧✿ 𝗗𝘂𝗿𝗮𝘀𝗶: ${res.duration}
୧✿ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${meta.channel}
୧✿ 𝗞𝘂𝗮𝗹𝗶𝘁𝗮𝘀: ${meta.media.quality} (${meta.media.resolution})
୧✿ 𝗨𝗸𝘂𝗿𝗮𝗻: ${meta.media.fileSize}
`.trim()

            // Kirim Video langsung dengan caption info
            await castorice.sendMessage(m.chat, { 
                video: { url: res.download }, 
                caption: caption,
                fileName: `${res.title}.mp4`
            }, { quoted: m })

        } catch (err) {
            console.error(err)
            m.reply(`⚠️ Error: Terjadi kesalahan pada server API atau ukuran video terlalu besar.`)
        }
    }
}
