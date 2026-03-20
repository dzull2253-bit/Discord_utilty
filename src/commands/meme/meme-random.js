const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateRandomMeme } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme-random')
    .setDescription('🎲 AI pilih template meme terbaik secara otomatis!')
    .addStringOption(o =>
      o.setName('topik')
        .setDescription('Topik untuk meme')
        .setRequired(true)
        .setMaxLength(300)),

  async execute(interaction) {
    const topik = interaction.options.getString('topik');
    await interaction.deferReply();

    const meme = await generateRandomMeme(topik);

    const embed = new EmbedBuilder()
      .setColor(0x8A2BE2)
      .setTitle('🎲 RANDOM MEME!')
      .setDescription(trunc(meme))
      .addFields({ name: '📌 Topik', value: topik, inline: true })
      .setFooter({ text: 'MemeGod • Template dipilih oleh takdir 🎰' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
