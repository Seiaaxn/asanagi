/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const axios = require('axios');

function getScore(jid, seed = 0) {
    const nomor = jid.replace('@s.whatsapp.net', '');
    let hash = seed;
    for (let i = 0; i < nomor.length; i++) {
        hash = ((hash << 5) - hash) + nomor.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function pick(arr, jid, seed = 0) {
    return arr[getScore(jid, seed) % arr.length];
}

function getMasaDepan(jid) {
    const karir = pick([
        'Pengusaha sukses yang punya banyak cabang bisnis',
        'Profesional ternama yang dihormati di bidangnya',
        'Content creator viral dengan jutaan pengikut',
        'Pegawai negeri yang hidupnya tenang dan stabil',
        'Freelancer handal yang kerjanya dari mana aja',
        'Investor cerdas yang uangnya kerja sendiri',
        'Dokter/tenaga ahli yang banyak membantu orang',
        'Pebisnis online yang orderannya ga pernah sepi'
    ], jid, 1);

    const rumah = pick([
        'rumah mewah di perumahan elite',
        'apartemen modern di tengah kota',
        'villa pinggir pantai yang tenang',
        'townhouse minimalis dengan taman luas',
        'rumah subsidi yang nyaman dan berkah',
        'kos-kosan mewah hasil sendiri'
    ], jid, 2);

    const kendaraan = pick([
        'mobil sport keluaran terbaru',
        'SUV mewah buat keluarga',
        'motor gede buat jalan-jalan',
        'mobil listrik canggih',
        'sepeda mahal plus mobil cadangan'
    ], jid, 3);

    const nasib = pick([
        '🌟 Hidupnya penuh berkah dan selalu dikelilingi orang-orang baik.',
        '✨ Rezekinya lancar, ga disangka-sangka datangnya dari mana.',
        '🍀 Selalu ada jalan keluar tiap kali ketemu masalah.',
        '💫 Hidupnya sederhana tapi bahagia, ga kurang suatu apapun.',
        '🌈 Banyak hal tak terduga yang bikin hidupnya makin seru.',
        '🔥 Perjuangannya berat di awal, tapi hasilnya luar biasa di akhir.'
    ], jid, 4);

    const umur = 25 + (getScore(jid, 5) % 10); // 25–34 tahun

    return { karir, rumah, kendaraan, nasib, umur };
}

module.exports = {
    name: 'Cek Masa Depan',
    command: ['cekmasadepan', 'masadepan', 'future'],
    category: 'cek',
    run: async (castorice, m, { prefix, command }) => {
        const target = m.mentionedJid?.[0] || m.quoted?.sender || null;

        if (!target) {
            return m.reply(`Tag seseorang dulu!\nContoh: *${prefix + command} @nomor*`);
        }

        const nomor = target.replace('@s.whatsapp.net', '');
        const { karir, rumah, kendaraan, nasib, umur } = getMasaDepan(target);

        
        let ppUrl = null;
        try { ppUrl = await castorice.profilePictureUrl(target, 'image'); } catch {}

        const caption =
            `🔮 *CEK MASA DEPAN* 🔮\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `👤 Nama    : *@${target.split('@')[0]}*\n` +
            `📱 Nomor   : *+${nomor}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `💼 Karir    : *${karir}*\n` +
            `🏠 Tinggal  : *${rumah}*\n` +
            `🚗 Kendaraan: *${kendaraan}*\n` +
            `🎯 Sukses di usia *${umur} tahun*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `${nasib}\n` +
            `━━━━━━━━━━━━━━━━\n` 
        if (ppUrl) {
            try {
                const res = await axios.get(ppUrl, { responseType: 'arraybuffer', timeout: 10000 });
                return await castorice.sendMessage(m.chat, {
                    image: Buffer.from(res.data),
                    caption,
                    mentions: [target]
                }, { quoted: m });
            } catch {}
        }

        await castorice.sendMessage(m.chat, { text: caption, mentions: [target] }, { quoted: m });
    }
};