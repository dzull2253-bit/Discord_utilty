const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ Tampilkan semua command yang tersedia!'),

  async execute(interaction) {
    let page = 0;

    const pages = [

      // PAGE 1 - AI ASISTEN
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🤖 AI')
        .setDescription(
          '`/ask`\n> Tanya apa saja ke AI\n\n' +
          '`/chat`\n> Chat AI dengan konteks percakapan\n\n' +
          '`/joke`\n> Dapatkan joke random\n\n' +
          '`/motivasi`\n> Kata motivasi biar semangat 🔥\n\n' +
          '`/fakta`\n> Fakta unik berdasarkan topik'
                    
          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 1/5' }),

      // PAGE 2 - ROAST
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🔥 AI Roasting')
        .setDescription(
          '`/roast @user`\n> Roast orang lain (pilih level)\n\n' +
          '`/roast-me`\n> Roast diri sendiri 🤡\n\n' +
          '`/roast-custom`\n> Roast berdasarkan deskripsi\n\n' +
          '> Level: ringan / sedang / brutal / sadis'

          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 2/5' }),

      // PAGE 3 - MODE MARAH
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('😡 AI Mode Marah')
        .setDescription(
          '`/marah`\n> AI ngamuk sesuai alasan\n\n' +
          '`/rant`\n> Curhat panjang + emosi\n\n' +
          '`/komplain`\n> Komplain dramatis 🤣'
          
          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 3/5' }),

      // PAGE 4 - MEME & YT
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('😂 Meme & YouTube')
        .setDescription(
          '**Meme:**\n' +
          '`/meme`\n> Kirim meme random\n\n' +
          '`/meme-random`\n> Meme sesuai topik\n\n' +
          '`/caption-meme`\n> Buat caption meme\n\n' +

          '**YouTube:**\n' +
          '`/yt-subscribe`\n> Subscribe channel (admin)\n\n' +
          '`/yt-unsubscribe`\n> Unsubscribe channel\n\n' +
          '`/yt-list`\n> Lihat daftar channel\n\n' +
          '`/yt-check`\n> Cek info channel'

          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 4/5' }),

      // PAGE 5 - UTILITAS
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('⚙️ Utilitas')
        .setDescription(
          '`/help`\n> Tampilkan menu ini\n\n' +
          '`/info`\n> Info tentang bot\n\n' +
          '`/ping`\n> Cek kecepatan bot\n\n' +
          '`/clear`\n> Hapus pesan (admin)\n\n' +

          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 5/5' }),
    ];

    const getButtons = () =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('⬅️')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('➡️')
          .setStyle(ButtonStyle.Primary)
      );

    const message = await interaction.reply({
      embeds: [pages[page]],
      components: [getButtons()],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      time: 60000,
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "Ini bukan tombol lu 😅", ephemeral: true });
      }

      if (i.customId === 'next') {
        page = (page + 1) % pages.length;
      } else if (i.customId === 'prev') {
        page = (page - 1 + pages.length) % pages.length;
      }

      await i.update({
        embeds: [pages[page]],
        components: [getButtons()],
      });
    });

    collector.on('end', () => {
      message.edit({ components: [] });
    });
  },
};
