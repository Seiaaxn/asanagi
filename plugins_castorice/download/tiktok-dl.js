/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const axios = require('axios');

module.exports = {
    name: 'TikTok Downloader',
    command: ['tiktok', 'tt', 'ttdl'],
    category: 'download',
    run: async (castorice, m, { text, prefix, command }) => {
        if (!text) return m.reply(`Mana linknya?\nContoh: ${prefix + command} https://vt.tiktok.com/ZSjXNEnbC/`)
        if (!/tiktok.com/.test(text)) return m.reply('Link TikTok tidak valid!')

        m.reply('Bentar...')

        try {
            const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`)
            
            if (response.data.code !== 0) return m.reply(`❌ Gagal: ${response.data.msg || 'Data tidak ditemukan'}`)

            const res = response.data.data
            const author = res.author || {}
            
            const caption = `
୧✿ 𝗔𝘂𝘁𝗵𝗼𝗿: ${author.nickname || '-'} (@${author.unique_id || '-'})
୧✿ 𝗗𝗲𝘀𝗰: ${res.title || '-'}\n
୧✿ 𝗟𝗶𝗸𝗲: ${res.digg_count || 0}
୧✿ 𝗣𝗹𝗮𝘆: ${res.play_count || 0}
୧✿ 𝗞𝗼𝗺𝗲𝗻: ${res.comment_count || 0}
`.trim()

            // 1. Handle Slide (Foto/Album)
            if (res.images && Array.isArray(res.images) && res.images.length > 0) {
                for (let imgUrl of res.images) {
                    await castorice.sendMessage(m.chat, { image: { url: imgUrl } }, { quoted: m })
                }
                // Kirim caption setelah foto-foto
                if (res.images.length > 0) {
                    await castorice.sendMessage(m.chat, { text: caption }, { quoted: m })
                }
            } else {
                // 2. Kirim Video (prioritas no watermark)
                const videoUrl = res.play || res.wmplay
                await castorice.sendMessage(m.chat, { 
                    video: { url: videoUrl }, 
                    caption: caption 
                }, { quoted: m })
            }

            // 3. Kirim Audio/Music (jika ada)
            if (res.music) {
                await castorice.sendMessage(m.chat, { 
                    audio: { url: res.music }, 
                    mimetype: 'audio/mp4', 
                    ptt: false // Set true kalau mau jadi Voice Note (VN)
                }, { quoted: m })
            }

        } catch (err) {
            console.error(err)
            m.reply(`⚠️ Error: ${err.message || 'API limit atau link bermasalah'}`)
        }
    }
}
