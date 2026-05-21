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
    return Math.abs(hash % 101); // 0–100
}

function getBar(score, length = 10) {
    const filled = Math.round((score / 100) * length);
    return '🔥'.repeat(filled) + '⬜'.repeat(length - filled);
}

function pick(arr, jid, seed = 0) {
    const nomor = jid.replace('@s.whatsapp.net', '');
    let hash = seed;
    for (let i = 0; i < nomor.length; i++) hash = ((hash << 3) + hash) ^ nomor.charCodeAt(i);
    return arr[Math.abs(hash) % arr.length];
}

function getLabel(score, jid) {
    if (score >= 90) return pick([
        '🥵 Wah Sange Berat Nih Ati ati tangan nya jangan ke bawah',
        '🥵 Kayaknya Tegang Banget Ya, Mau di bantuin gak? Di bantuin sadar wkwkkw',
        '🥵 Liatin Tangan nya woy bahaya banget!'
    ], jid, 1);
    if (score >= 75) return pick([
        '🔥 Wah parah banget, Tidur aja Sih kalo kata gw mah',
        '🔥 Liatin Chrome nya woy Agak Waspada Gw',
        '🔥 Tarik Nafas..... Jangan buka Chrome apalagi buka Celana wkkw'
    ], jid, 2);
    if (score >= 55) return pick([
        '😤 Agak Sange tapi masih bisa tahan dia',
        '😤 Setengah matang, antara iya dan iya banget!',
        '😤 Udah mulai hangat, butuh pendingin kayaknya!'
    ], jid, 3);
    if (score >= 35) return pick([
        '😐 Masih aman, tapi jangan lama sendirian!',
        '😐 Standar aja, belum sampai tahap buka.....!',
        '😐 Biasa-biasa aja, masih dalam batas wajar!'
    ], jid, 4);
    if (score >= 15) return pick([
        '😇 Stay Halal Dia bruh, iman nya kuat',
        '😇 Tenang banget jangan di godain aja!',
        '😇 Adem ayem, kayak ip di pake main pou!'
    ], jid, 5);
    return pick([
        '🧊 SUCI BANGET! Ini mah es batu juga kalah dinginnya!',
        '🧊 Lagi mikirin hutang kayaknya jdi gak sange',
        '🧊 Nikah yuk aku suka yang gak sangean'
    ], jid, 6);
}

module.exports = {
    name: 'Cek Sange',
    command: ['ceksange', 'sange'],
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
            `🌡️ *CEK SANGE* 🌡️\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `👤 Nama   : *@${target.split('@')[0]}*\n` +
            `📱 Nomor  : *+${nomor}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📊 Level  : *${score}/100*\n` +
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