const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateMotivation } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motivasi')
    .setDescription(' mintak kata kata motivasi sini biar ngk setres  '),

  async execute(interaction) {
    await interaction.deferReply();
    const motivasi = await generateMotivation();
    const embed = new EmbedBuilder()
      .setColor(0xFF8C00)
      .setTitle('💪 Kata-Kata Motivasi dari AI')
      .setDescription(trunc(motivasi))
      .setFooter({ text: `Keep going! • ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  },
};
