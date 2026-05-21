/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const axios = require('axios');

module.exports = {
    name: 'Instagram Downloader',
    command: ['ig', 'igdl', 'instagram'],
    category: 'download',
    run: async (castorice, m, { text, prefix, command }) => {
        if (!text) return m.reply(`Mana link Instagram-nya?\nContoh: ${prefix + command} https://www.instagram.com/p/xxxx/`)
        
        if (!/instagram.com/.test(text)) return m.reply('Link Instagram tidak valid!')

        m.reply('Bentar ya...')

        try {
            const response = await axios.get(`https://www.sankavolereii.my.id/download/instagram?apikey=planaai&url=${encodeURIComponent(text)}`)
            
            if (!response.data.status || !response.data.result.media) return m.reply(`❌ Gagal: Media tidak ditemukan atau link bersifat private.`)

            const { media, caption: igCap } = response.data.result
            
            for (let item of media) {
                if (item.type === 'image') {
                    await castorice.sendMessage(m.chat, { 
                        image: { url: item.url }, 
                        caption: igCap || '' 
                    }, { quoted: m })
                } else if (item.type === 'video') {
                    await castorice.sendMessage(m.chat, { 
                        video: { url: item.url }, 
                        caption: igCap || '' 
                    }, { quoted: m })
                }
            }

        } catch (err) {
            console.error(err)
            m.reply(`⚠️ Error: Terjadi masalah pada server API atau link tidak dapat diakses.`)
        }
    }
}
