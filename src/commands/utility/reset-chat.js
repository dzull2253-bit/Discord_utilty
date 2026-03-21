const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-chat')
    .setDescription('🔄 Hapus history percakapan AI kamu (mulai dari awal)!'),

  async execute(interaction, client) {
    client.conversations.delete(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🔄 Percakapan Direset!')
      .setDescription('History percakapan AI kamu sudah dihapus.\nSekarang kamu bisa mulai percakapan baru dari awal! 🤖')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
