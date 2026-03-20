const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFact } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fakta')
    .setDescription('🧠 Fakta random mengejutkan dari AI!')
    .addStringOption(o => o.setName('topik').setDescription('Topik fakta (opsional)').setRequired(false).setMaxLength(200)),

  async execute(interaction) {
    await interaction.deferReply();
    const topik = interaction.options.getString('topik');
    const fakta = await generateFact(topik);

    const embed = new EmbedBuilder()
      .setColor(0x0096FF)
      .setTitle('🧠 Fakta Mengejutkan!')
      .setDescription(trunc(fakta))
      .setFooter({ text: 'TIL (Today I Learned) • NexusAI' })
      .setTimestamp();
    if (topik) embed.addFields({ name: '🏷️ Topik', value: topik, inline: true });

    await interaction.editReply({ embeds: [embed] });
  },
};
