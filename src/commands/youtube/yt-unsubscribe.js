const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { unsubscribe } = require('../../services/youtubeService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yt-unsubscribe')
    .setDescription('🔕 Unsubscribe notifikasi YouTube channel!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o =>
      o.setName('channel_id')
        .setDescription('YouTube Channel ID yang ingin dihapus')
        .setRequired(true)),

  async execute(interaction, client) {
    if (!interaction.inGuild()) {
      return interaction.reply({ content: '❌ Command ini hanya bisa digunakan di server!', ephemeral: true });
    }

    const channelId = interaction.options.getString('channel_id');
    const result = unsubscribe(client.ytSubscriptions, interaction.guildId, channelId);

    const embed = new EmbedBuilder()
      .setColor(result.success ? 0x57F287 : 0xED4245)
      .setTitle(result.success ? '✅ Unsubscribe Berhasil!' : '❌ Unsubscribe Gagal')
      .setDescription(result.msg)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
