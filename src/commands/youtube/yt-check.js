const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { manualCheck, fmtNum } = require('../../services/youtubeService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yt-check')
    .setDescription('🔍 Cek info & video terbaru dari sebuah YouTube channel!')
    .addStringOption(o =>
      o.setName('channel_id')
        .setDescription('YouTube Channel ID (contoh: UCxxxxxx)')
        .setRequired(true)),

  async execute(interaction) {
    const channelId = interaction.options.getString('channel_id');
    await interaction.deferReply();

    if (!process.env.YOUTUBE_API_KEY) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('❌ YouTube API Key Tidak Dikonfigurasi')
            .setDescription('Hubungi admin bot untuk mengatur `YOUTUBE_API_KEY` di file `.env`.')
            .setTimestamp(),
        ],
      });
    }

    const result = await manualCheck(channelId);
    if (!result) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('❌ Channel Tidak Ditemukan')
            .setDescription(`Channel ID \`${channelId}\` tidak ditemukan. Pastikan ID benar!`)
            .setTimestamp(),
        ],
      });
    }

    const { info, video, live } = result;

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(`📺 ${info.name}`)
      .setURL(info.url)
      .setThumbnail(info.thumbnail)
      .addFields(
        { name: '👥 Subscribers', value: fmtNum(info.subscribers), inline: true },
        { name: '🎬 Total Videos', value: fmtNum(info.videos), inline: true },
        { name: '👁️ Total Views', value: fmtNum(info.views), inline: true },
      );

    if (live) {
      embed.addFields({
        name: '🔴 SEDANG LIVE!',
        value: `[${live.title}](${live.url})`,
        inline: false,
      });
    }

    if (video) {
      embed.addFields(
        { name: '📹 Video Terbaru', value: `[${video.title}](${video.url})`, inline: false },
        { name: '👁️ Views', value: fmtNum(video.views), inline: true },
        { name: '❤️ Likes', value: fmtNum(video.likes), inline: true },
        { name: '⏰ Upload', value: video.publishedAt, inline: true },
      );
      if (video.thumbnail) embed.setImage(video.thumbnail);
    }

    embed
      .setFooter({ text: `Channel ID: ${channelId}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
