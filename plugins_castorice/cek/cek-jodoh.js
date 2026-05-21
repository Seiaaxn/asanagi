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

// Deskripsi jodoh untuk cowok (jodohnya cewek)
function getJodohCowok(jid) {
    const nama = pick([
        'Nazwa', 'Adelia', 'Rania', 'Safira', 'Naura',
        'Keisya', 'Alisha', 'Zara', 'Nadia', 'Putri'
    ], jid, 1);

    const sifat = pick([
        'pendiam tapi perhatian banget ke orang yang disayang',
        'cerewet tapi lucu dan bikin suasana jadi hidup',
        'kalem dan sabar, tipe yang bikin tenang kalau lagi pusing',
        'mandiri dan punya pendirian, ga gampang ikut-ikutan',
        'humoris dan easy going, gampang diajak ngobrol apapun',
        'serius di luar tapi lebay dan konyol kalau udah deket'
        ], jid, 2);

    const asal = pick([
        'orang Jawa yang lemah lembut',
        'orang Sunda yang manis dan ramah',
        'orang Betawi yang blak-blakan tapi setia',
        'orang Minang yang cermat dan cerdas',
        'orang Sulawesi yang loyal dan tegas',
        'orang campuran yang punya pesona unik'
    ], jid, 3);

    const ketemu = pick([
        'kalian bakal ketemu lewat teman yang sama',
        'kalian bakal ketemu secara ga sengaja di tempat umum',
        'kalian bakal ketemu lewat media sosial',
        'kalian bakal ketemu di lingkungan kerja atau kuliah',
        'kalian bakal dikenalkan oleh keluarga',
        'kalian bakal ketemu di momen yang paling ga terduga'
    ], jid, 4);

    const cocok = pick([
        '💞 Kalian bakal saling melengkapi satu sama lain dengan sempurna.',
        '💞 Awalnya biasa aja, tapi lama-lama ga bisa bayangin hidup tanpa dia.',
        '💞 Banyak perbedaan, tapi justru itu yang bikin kalian kuat.',
        '💞 Ketawa bareng jadi rutinitas, susah juga dihadapin bareng.',
        '💞 Dia yang paling ngerti kamu bahkan tanpa kamu ngomong sepatah pun.'
    ], jid, 5);

    return { nama, sifat, asal, ketemu, cocok };
}

// Deskripsi jodoh untuk cewek (jodohnya cowok)
function getJodohCewek(jid) {
    const nama = pick([
        'Kaelz', 'Farhan', 'Daffa', 'Aryan', 'Hafiz',
        'Reza', 'Gibran', 'Naufal', 'Ilham', 'Fadhil'
    ], jid, 1);

    const sifat = pick([
        'pendiam tapi protektif banget ke orang yang disayang',
        'jail dan bawel tapi selalu ada di saat dibutuhkan',
        'kalem dan cool, tipe yang bikin kamu ngerasa aman',
        'ambisius dan pekerja keras, ga pernah nyerah sama keadaan',
        'humoris dan santai, bisa bikin kamu ketawa di saat terburuk',
        'tegas di luar tapi lembut banget kalau udah kenal dekat'
    ], jid, 2);

    const asal = pick([
        'orang Jawa yang sopan dan bertanggung jawab',
        'orang Sunda yang kalem tapi berprinsip',
        'orang Batak yang blak-blakan dan setia',
        'orang Minang yang cerdas dan ulet',
        'orang Sulawesi yang teguh dan pemberani',
        'orang campuran yang punya daya tarik tersendiri'
    ], jid, 3);

    const ketemu = pick([
        'kalian bakal ketemu lewat teman yang sama',
        'kalian bakal ketemu secara ga sengaja di tempat tak terduga',
        'kalian bakal ketemu lewat media sosial',
        'kalian bakal ketemu di lingkungan kerja atau kampus',
        'kalian bakal dikenalkan oleh seseorang yang kalian percaya',
        'kalian bakal ketemu di momen yang paling ga kamu kira'
    ], jid, 4);

    const cocok = pick([
        '💞 Dia yang bakal bikin kamu ngerasa cukup apa adanya.',
        '💞 Awalnya biasa aja, tapi lama-lama susah ngebayangin tanpa dia.',
        '💞 Banyak perbedaan, tapi justru itu yang bikin kalian solid.',
        '💞 Dia selalu tau cara ngangkat mood kamu tanpa perlu banyak kata.',
        '💞 Paling ngerti kamu bahkan di saat kamu sendiri ga ngerti diri kamu.'
    ], jid, 5);

    return { nama, sifat, asal, ketemu, cocok };
}

module.exports = {
    name: 'Cek Jodoh',
    command: ['cekjodoh', 'jodoh'],
    category: 'cek',
    run: async (castorice, m, { prefix, command, args }) => {
        const target = m.mentionedJid?.[0] || m.quoted?.sender || null;

        if (!target) {
            return m.reply(
                `Tag seseorang dulu!\nContoh:\n` +
                `*${prefix + command} @nomor cowok* — kalo orangnya cowok\n` +
                `*${prefix + command} @nomor cewek* — kalo orangnya cewek`
            );
        }

        const gender = args.find(a => ['cowok', 'cewek', 'laki', 'perempuan', 'pria', 'wanita'].includes(a.toLowerCase()))?.toLowerCase();

        if (!gender) {
            return m.reply(
                `Sebutkan gendernya juga!\nContoh:\n` +
                `*${prefix + command} @nomor cowok*\n` +
                `*${prefix + command} @nomor cewek*`
            );
        }

        const isCowok = ['cowok', 'laki', 'pria'].includes(gender);
        const nomor = target.replace('@s.whatsapp.net', '');
        const { nama, sifat, asal, ketemu, cocok } = isCowok ? getJodohCowok(target) : getJodohCewek(target);

        
        let ppUrl = null;
        try { ppUrl = await castorice.profilePictureUrl(target, 'image'); } catch {}

        const caption =
            `💘 *CEK JODOH* 💘\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `👤 Nama    : *@${target.split('@')[0]}*\n` +
            `📱 Nomor   : *+${nomor}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `💑 Jodohnya seorang *${isCowok ? 'cewek' : 'cowok'}* bernama *${nama}*\n\n` +
            `🌸 Sifatnya *${sifat}*\n\n` +
            `🗺️ Dia *${asal}*\n\n` +
            `🤝 Cara ketemunya: *${ketemu}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `${cocok}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `> © ${global.bot || 'Castorice MD'}`;

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