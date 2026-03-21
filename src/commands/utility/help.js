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
        .setTitle('AI Asisten & Meme')
        .setDescription(
          '`/mc ip`\n> IP server Minecraft\n' +
          '`/mc online`\n> chek berapa yang online di server\n' +
          '`/ask`\n> Tanya apa saja ke AI\n' +
          '`/chat`\n> Chat AI dengan konteks percakapan\n' +
          '`/joke`\n> Dapatkan joke random\n' +
          '`/motivasi`\n> Kata motivasi biar semangat 🔥\n' +
          '`/fakta`\n> Fakta unik berdasarkan topik\n\n' +
          
          '**Meme:**\n' +
          '`/meme`\n> Kirim meme random\n\n' +   
          
          '**Tips:**\n' +
          'Minecraft server : **kocak.playserver.pro**\n'
          '                   **21710**\n' 
          'Mention bot + pertanyaan langsung bisa AI jawab (@kocak utils [pertanyaan])'
        )
        .setFooter({ text: 'Page 1/4' }),

      // PAGE 2 - ROAST
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('AI Roasting')
        .setDescription(
          '`/roast @user`\n> Roast orang lain (pilih level)\n' +
          '`/roast-me`\n> Roast diri sendiri 🤡\n' +
          '`/roast-custom`\n> Roast berdasarkan deskripsi\n' +
          '> Level: ringan / sedang / brutal / sadis\n\n' +

          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 2/4' }),

      // PAGE 3 - MODE MARAH
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('AI Marah & Notif Youtube')
        .setDescription(
          '`/marah`\n> AI ngamuk sesuai alasan\n' +
          '`/rant`\n> Curhat panjang + emosi\n' +
          '`/komplain`\n> Komplain dramatis \n\n' +

          '**YouTube:**\n' +
          '`/yt-subscribe`\n> Subscribe channel (admin)\n' +
          '`/yt-unsubscribe`\n> Unsubscribe channel\n' +
          '`/yt-list`\n> Lihat daftar channel\n' +
          '`/yt-check`\n> Cek info channel\n\n' +
          
          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 3/4' }),

      // PAGE 4 - UTILITAS
      new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('Utilitas')
        .setDescription(
          '`/help`\n> Tampilkan menu ini\n\n' +
          '`/info`\n> Info tentang bot\n\n' +
          '`/ping`\n> Cek kecepatan bot\n\n' +
          '`/clear`\n> Hapus pesan (admin)\n\n' +

          '**Tips:**\n' +
          'Mention bot + pertanyaan langsung bisa AI jawab 😎'
        )
        .setFooter({ text: 'Page 4/4' }),
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
