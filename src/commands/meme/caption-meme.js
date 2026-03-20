const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateMemeCaption } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('caption-meme')
    .setDescription('🖼️ Buat caption meme lucu dari situasi apapun!')
    .addStringOption(o =>
      o.setName('situasi')
        .setDescription('Deskripsi situasi yang mau dijadikan meme')
        .setRequired(true)
        .setMaxLength(500)),

  async execute(interaction) {
    const situasi = interaction.options.getString('situasi');
    await interaction.deferReply();

    const caption = await generateMemeCaption(situasi);

    const embed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('🖼️ MEME CAPTION GENERATOR')
      .setDescription(trunc(caption))
      .addFields({ name: '📖 Situasi', value: trunc(situasi, 512) })
      .setFooter({ text: 'MemeGod Caption Edition 😂' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
