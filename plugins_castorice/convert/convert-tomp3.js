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
    name: 'To Audio MP3',
    command: ['tomp3', 'toaudio'],
    category: 'converter',
    run: async (nana, m, { prefix, command }) => {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';

        // Validasi: Harus berupa video atau audio/vn
        if (!/video|audio/.test(mime)) {
            return m.reply(`Balas video atau voice note yang ingin diubah ke MP3 dengan perintah *${prefix + command}*`)
        }

        m.reply('Sedang mengonversi ke MP3... Mohon tunggu.')

        try {
            // 1. Download media
            const media = await q.download();
            
            // 2. Siapkan path file sementara pake os.tmpdir()
            const filename = Date.now();
            const tempInput = path.join(os.tmpdir(), `${filename}_input`);
            const tempOutput = path.join(os.tmpdir(), `${filename}.mp3`);

            // Tulis buffer ke file temp
            fs.writeFileSync(tempInput, media);

            // 3. Proses konversi menggunakan FFMPEG
            // -q:a 2 itu kualitas variable bitrate yang bagus (~190kbps)
            exec(`ffmpeg -i ${tempInput} -vn -acodec libmp3lame -q:a 2 ${tempOutput}`, async (err) => {
                // Hapus file input mentah
                if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);

                if (err) {
                    console.error('FFMPEG Error:', err);
                    return m.reply('⚠️ Gagal mengonversi audio.');
                }

                // 4. Baca hasil konversi
                const audioBuffer = fs.readFileSync(tempOutput);

                // 5. Kirim hasil
                await nana.sendMessage(m.chat, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `nana-bot_${filename}.mp3`
                }, { quoted: m });

                // 6. Hapus file output setelah dikirim biar nggak menuhin storage
                if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
            });

        } catch (err) {
            console.error('Error ToMP3:', err);
            m.reply(`⚠️ Terjadi kesalahan: ${err.message}`);
        }
    }
          }
