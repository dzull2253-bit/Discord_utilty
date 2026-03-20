const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { subscribe } = require('../../services/youtubeService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yt-subscribe')
    .setDescription('📺 Subscribe notifikasi YouTube channel ke server ini!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o =>
      o.setName('channel_id')
        .setDescription('YouTube Channel ID (contoh: UCxxxxxx)')
        .setRequired(true))
    .addChannelOption(o =>
      o.setName('notif_channel')
        .setDescription('Channel Discord untuk notifikasi')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)),

  async execute(interaction, client) {
    if (!interaction.inGuild()) {
      return interaction.reply({ content: '❌ Command ini hanya bisa digunakan di server!', ephemeral: true });
    }

    const channelId       = interaction.options.getString('channel_id');
    const discordChannel  = interaction.options.getChannel('notif_channel');

    await interaction.deferReply({ ephemeral: true });

    const result = await subscribe(
      client.ytSubscriptions,
      interaction.guildId,
      channelId,
      discordChannel.id
    );

    const embed = new EmbedBuilder()
      .setColor(result.success ? 0x57F287 : 0xED4245)
      .setTitle(result.success ? '✅ Subscribe Berhasil!' : '❌ Subscribe Gagal')
      .setDescription(result.msg)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
