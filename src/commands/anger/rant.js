const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateRant } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rant')
    .setDescription('🤬 AI ngomel panjang lebar soal topik ini!')
    .addStringOption(o =>
      o.setName('topik')
        .setDescription('Topik yang bikin kesel')
        .setRequired(true)
        .setMaxLength(300)),

  async execute(interaction) {
    const topik = interaction.options.getString('topik');
    await interaction.deferReply();

    const response = await generateRant(topik);

    const embed = new EmbedBuilder()
      .setColor(0xC80032)
      .setTitle(`🤬 RANT MODE: ${topik.toUpperCase().slice(0, 50)}`)
      .setDescription(trunc(response))
      .setFooter({ text: 'RageBot • Ngomel tanpa henti 😤' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
