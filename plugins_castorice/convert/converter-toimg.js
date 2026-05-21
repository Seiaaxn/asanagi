/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
    name: 'Sticker to Image',
    command: ['toimg', 'toimage'],
    category: 'converter',
    run: async (castorice, m, { prefix, command }) => {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';

        // Validasi: Harus sticker webp
        if (!/webp/.test(mime)) {
            return m.reply(`Balas sticker yang ingin diubah ke gambar dengan perintah *${prefix + command}*`);
        }

        // Cek apakah sticker bergerak (animated)
        if (q.isAnimated) {
            return m.reply('Maaf, fitur ini hanya untuk sticker statis.');
        }

        m.reply('Sedang mengonversi sticker ke gambar...');

        try {
            // 1. Download sticker
            const media = await q.download();
            
            // 2. Siapkan path temp
            const filename = Date.now();
            const tempInput = path.join(os.tmpdir(), `${filename}.webp`);
            const tempOutput = path.join(os.tmpdir(), `${filename}.png`);

            fs.writeFileSync(tempInput, media);

            // 3. Proses konversi via FFMPEG
            // -vframes 1 untuk mastiin cuma ngambil 1 frame
            exec(`ffmpeg -i ${tempInput} -vframes 1 ${tempOutput}`, async (err) => {
                // Hapus input temp
                if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);

                if (err) {
                    console.error('FFMPEG Error:', err);
                    return m.reply('❌ Gagal mengonversi sticker.');
                }

                // 4. Baca hasil
                const imageBuffer = fs.readFileSync(tempOutput);

                // 5. Kirim sebagai gambar biasa
                await castorice.sendMessage(m.chat, {
                    image: imageBuffer,
                    caption: `✨ *Convert Selesai*`
                }, { quoted: m });

                // 6. Hapus output temp
                if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
            });

        } catch (err) {
            console.error('Error ToImg:', err);
            m.reply(`⚠️ Terjadi kesalahan: ${err.message}`);
        }
    }
};
