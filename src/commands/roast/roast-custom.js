const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateRoast } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast-custom')
    .setDescription('💀 Roast seseorang berdasarkan deskripsi kustom!')
    .addStringOption(o =>
      o.setName('deskripsi')
        .setDescription('Deskripsikan orang yang mau di-roast')
        .setRequired(true)
        .setMaxLength(500))
    .addStringOption(o =>
      o.setName('level')
        .setDescription('Level roasting')
        .setRequired(false)
        .addChoices(
          { name: '😊 Ringan', value: 'ringan' },
          { name: '🌶️ Sedang', value: 'sedang' },
          { name: '🔥 Brutal', value: 'brutal' },
          { name: '💀 Sadis', value: 'sadis' },
        )),

  async execute(interaction) {
    const deskripsi = interaction.options.getString('deskripsi');
    const level     = interaction.options.getString('level') ?? 'brutal';

    await interaction.deferReply();
    const roast = await generateRoast('Seseorang', deskripsi, level);

    const embed = new EmbedBuilder()
      .setColor(0xDC143C)
      .setTitle('🔥 CUSTOM ROAST! 🔥')
      .setDescription(trunc(roast))
      .addFields(
        { name: '📝 Deskripsi Target', value: trunc(deskripsi, 512) },
        { name: '🌡️ Level', value: level.toUpperCase(), inline: true },
        { name: '😈 Roaster', value: interaction.user.toString(), inline: true },
      )
      .setFooter({ text: `Roasted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
