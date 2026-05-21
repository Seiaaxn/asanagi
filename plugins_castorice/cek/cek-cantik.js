/* 
========================================
   Kaelsenpai Castorice MD © 2025-2026 
   Dilarang menghapus Creadit 
   Castorice MD - Hak cipta di lindungi
========================================
*/

const axios = require('axios');

function getScore(jid) {
    const nomor = jid.replace('@s.whatsapp.net', '');
    let hash = 0;
    for (let i = 0; i < nomor.length; i++) {
        hash = ((hash << 5) - hash) + nomor.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 41) + 60; // range 60–100
}

function getBar(score, total = 100, length = 10) {
    const filled = Math.round((score / total) * length);
    return '█'.repeat(filled) + '░'.repeat(length - filled);
}

function pick(arr, jid) {
    const nomor = jid.replace('@s.whatsapp.net', '');
    let hash = 0;
    for (let i = 0; i < nomor.length; i++) hash = ((hash << 3) + hash) ^ nomor.charCodeAt(i);
    return arr[Math.abs(hash) % arr.length];
}

function getLabel(score, jid) {
    if (score >= 95) return pick([
        '👑 Cantiknya udah level dewa, MasyaAllah!',
        '👑 Sempurna banget, kayak karakter anime utama!',
        '👑 Autocantik dari lahir, ga bisa diperdebatkan!'
    ], jid);
    if (score >= 90) return pick([
        '🌸 Super cantik! Lewat aja bikin orang noleh dua kali!',
        '🌸 Cantiknya beneran ga ketulungan, serius deh!',
        '🌸 Kalo masuk TV pasti langsung jadi bintang utama!'
    ], jid);
    if (score >= 85) return pick([
        '✨ Cantik banget, auranya nyebar kemana-mana!',
        '✨ Manis banget, senyum dikit aja udah bikin baper!',
        '✨ Cantiknya natural, ga perlu filter sama sekali!'
    ], jid);
    if (score >= 78) return pick([
        '💖 Cantik! Tapi masih ada ruang buat makin glowing lagi!',
        '💖 Lucu dan manis, pesona-nya dapet banget kok!',
        '💖 Cantik kok, tinggal pede aja udah lebih dari cukup!'
    ], jid);
    if (score >= 70) return pick([
        '🌼 Lumayan cantik, tergantung angle-nya juga sih hehe!',
        '🌼 Ada charm-nya sendiri, yang penting percaya diri!',
        '🌼 Cantik versi unik, beda dari yang lain itu nilai plus!'
    ], jid);
    return pick([
        '🙈 Hmm... inner beauty-nya mungkin lebih menonjol!',
        '🙈 Cantik itu dari hati kok, santai aja gapaapa!',
        '🙈 Belum ketemu angle yang pas kali, coba lagi ntar!'
    ], jid);
}

module.exports = {
    name: 'Cek Cantik',
    command: ['cekcantik', 'cantik'],
    category: 'cek',
    run: async (castorice, m, { prefix, command }) => {
        const target = m.mentionedJid?.[0] || m.quoted?.sender || null;

        if (!target) {
            return m.reply(`Tag seseorang dulu!\nContoh: *${prefix + command} @nomor*`);
        }

        const nomor = target.replace('@s.whatsapp.net', '');
        const score = getScore(target);
        const bar = getBar(score);
        const label = getLabel(score, target);
        let ppUrl = null;
        try { ppUrl = await castorice.profilePictureUrl(target, 'image'); } catch {}

        const caption =
            `🌸 *CEK CANTIK* 🌸\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `👤 Nama   : *@${target.split('@')[0]}*\n` +
            `📱 Nomor  : *+${nomor}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📊 Skor   : *${score}/100*\n` +
            `${bar}\n` +
            `💬 ${label}\n` +
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
