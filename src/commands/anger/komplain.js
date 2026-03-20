const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateComplain } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('komplain')
    .setDescription('😤 AI komplain maksimal dan dramatis!')
    .addStringOption(o =>
      o.setName('masalah')
        .setDescription('Apa masalahnya?')
        .setRequired(true)
        .setMaxLength(500)),

  async execute(interaction) {
    const masalah = interaction.options.getString('masalah');
    await interaction.deferReply();

    const response = await generateComplain(masalah);

    const embed = new EmbedBuilder()
      .setColor(0xFF8C00)
      .setTitle('😤 KOMPLAIN LEVEL MAX! 😤')
      .setDescription(trunc(response))
      .addFields({ name: '📢 Masalah', value: trunc(masalah, 512) })
      .setFooter({ text: 'Komplain dikirim ke... entah siapa 📮' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
