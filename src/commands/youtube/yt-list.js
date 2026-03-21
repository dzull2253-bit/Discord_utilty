const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { listSubscriptions } = require('../../services/youtubeService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yt-list')
    .setDescription('📋 Lihat semua YouTube channel yang di-subscribe di server ini!'),

  async execute(interaction, client) {
    if (!interaction.inGuild()) {
      return interaction.reply({ content: '❌ Command ini hanya bisa digunakan di server!', ephemeral: true });
    }

    const subs = listSubscriptions(client.ytSubscriptions, interaction.guildId);

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('📋 Daftar YouTube Subscription')
      .setTimestamp();

    if (subs.length === 0) {
      embed.setDescription(
        '🔕 Belum ada subscription YouTube di server ini.\n' +
        'Gunakan `/yt-subscribe` untuk menambahkan!'
      );
    } else {
      embed.setDescription(`Total: **${subs.length}** subscription aktif`);
      subs.forEach((sub, i) => {
        embed.addFields({
          name: `${i + 1}. 📺 ${sub.name}`,
          value:
            `**Channel ID:** \`${sub.channelId}\`\n` +
            `**Notif ke:** <#${sub.discordChannelId}>\n` +
            `**Status Live:** ${sub.isLive ? '🔴 Sedang Live!' : '⭕ Offline'}`,
          inline: false,
        });
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
