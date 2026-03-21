const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Tampilkan semua command yang tersedia!'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 KOCAK Bot — Panduan Lengkap')
      .setDescription('Bot Discord AI serbaguna dengan berbagai fitur keren!\nGunakan `/` lalu ketik nama command.')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: '🧠 AI Asisten',
          value:
            '`/ask` — Tanya apapun ke AI\n' +
            '`/chat` — Chat dengan konteks percakapan\n' +
            '`/joke` — Joke lucu dari AI\n' +
            '`/motivasi` — Kata motivasi powerful\n' +
            '`/fakta [topik]` — Fakta mengejutkan',
          inline: false,
        },
        {
          name: '🔥 AI Roasting',
          value:
            '`/roast @user [level]` — Roast seseorang\n' +
            '`/roast-me` — Roast diri sendiri\n' +
            '`/roast-custom [deskripsi]` — Roast kustom\n' +
            '> Level: ringan / sedang / brutal / sadis',
          inline: false,
        },
        {
          name: '😡 AI Mode Marah',
          value:
            '`/marah [alasan]` — AI ngamuk dramatis!\n' +
            '`/rant [topik]` — AI ngomel panjang lebar\n' +
            '`/komplain [masalah]` — AI komplain max',
          inline: false,
        },
        {
          name: '😂 AI Meme Generator',
          value:
            '`/meme [template] [topik]` — Generate meme\n' +
            '`/meme-random [topik]` — Meme template random\n' +
            '`/caption-meme [situasi]` — Caption meme',
          inline: false,
        },
        {
          name: '📺 YouTube Notifications',
          value:
            '`/yt-subscribe` — Subscribe channel YouTube *(Admin)*\n' +
            '`/yt-unsubscribe` — Unsubscribe *(Admin)*\n' +
            '`/yt-list` — Lihat daftar subscription\n' +
            '`/yt-check [channel_id]` — Cek info channel',
          inline: false,
        },
        {
          name: '🛠️ Utilitas',
          value:
            '`/help` — Panduan ini\n' +
            '`/info` — Info bot\n' +
            '`/ping` — Cek latensi\n' +
            '`/clear [n]` — Hapus n pesan *(Admin)*',
          inline: false,
        },
        {
          name: '💡 Tips',
          value: 'Kamu juga bisa **mention bot** (`@NexusAI [pertanyaan]`) untuk chat langsung tanpa slash command!',
          inline: false,
        },
      )
      .setFooter({ text: 'NexusAI v2.0 • Dibuat dengan ❤️ dan banyak kopi ☕' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
