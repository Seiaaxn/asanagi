/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/
const axios = require('axios');

module.exports = {
    name: 'CapCut Downloader',
    command: ['capcut', 'cc', 'ccdl'],
    category: 'download',
    run: async (castorice, m, { text, prefix, command }) => {
        if (!text) return m.reply(`❌ Masukkan link CapCut!\nContoh: ${prefix + command} https://www.capcut.com/t/xxx`);
        if (!/capcut\.com/i.test(text)) return m.reply(`❌ Link tidak valid! Harus dari capcut.com`);

        m.reply('⏳ Sedang mengunduh video CapCut...');

        try {
            const res = await axios.get(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(text)}`);
            const { status, data } = res.data;

            if (!status || !data || data.code !== 200) return m.reply(`❌ Gagal mengambil video. Coba link lain!`);

            const title = (data.title || 'Untitled').replace(/\n/g, '').trim();
            const author = (data.authorName || 'Unknown').trim();
            const videoUrl = data.originalVideoUrl;
            const coverUrl = data.coverUrl;

            if (!videoUrl) return m.reply(`❌ Video tidak ditemukan. Pastikan link publik!`);

            const caption =
`🎬 *CapCut Downloader*
━━━━━━━━━━━━━━━━━━━━
📌 Judul: ${title}
👤 Author: ${author}
━━━━━━━━━━━━━━━━━━━━
_Asanagi Umi | Shyxn_`;

            await castorice.sendMessage(m.chat, {
                video: { url: videoUrl },
                caption
            }, { quoted: m });

        } catch (err) {
            console.error('[CAPCUT-DL ERROR]', err.message);
            m.reply(`⚠️ Gagal mengunduh! Coba beberapa saat lagi.`);
        }
    }
};
