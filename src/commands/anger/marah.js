const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateAnger } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('marah')
    .setDescription('😡 AI mode MARAH — jawab dengan penuh amarah!')
    .addStringOption(o =>
      o.setName('alasan')
        .setDescription('Kenapa AI harus marah?')
        .setRequired(true)
        .setMaxLength(500)),

  async execute(interaction) {
    const alasan = interaction.options.getString('alasan');
    await interaction.deferReply();

    const response = await generateAnger(alasan);

    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('😡 MODE MARAH ON! 😡')
      .setDescription(trunc(response))
      .addFields({ name: '💢 Penyebab Kemarahan', value: trunc(alasan, 512) })
      .setFooter({ text: 'RageBot v2.0 • NGAMUK MODE 🤬' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
