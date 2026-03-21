const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🧹 Hapus sejumlah pesan dari channel!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o =>
      o.setName('jumlah')
        .setDescription('Jumlah pesan yang dihapus (1–100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),

  async execute(interaction) {
    if (!interaction.inGuild()) {
      return interaction.reply({ content: '❌ Hanya bisa digunakan di server!', ephemeral: true });
    }

    const amount = interaction.options.getInteger('jumlah');
    await interaction.deferReply({ ephemeral: true });

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('🧹 Pesan Berhasil Dihapus!')
        .setDescription(
          `✅ Berhasil menghapus **${deleted.size}** pesan.\n` +
          (deleted.size < amount ? `\n⚠️ ${amount - deleted.size} pesan tidak bisa dihapus (mungkin terlalu lama/sudah pin).` : '')
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('❌ Gagal Menghapus Pesan')
            .setDescription(`Error: ${err.message}`)
            .setTimestamp(),
        ],
      });
    }
  },
};
