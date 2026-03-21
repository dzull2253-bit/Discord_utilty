const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askAssistant } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Tanya apa saja pada AI!')
    .addStringOption(o => o.setName('pertanyaan').setDescription('Pertanyaan kamu').setRequired(true).setMaxLength(1000)),

  async execute(interaction, client) {
    const question = interaction.options.getString('pertanyaan');
    await interaction.deferReply();

    const response = await askAssistant(client.conversations, interaction.user.id, question);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Nungguin ya')
      .addFields(
        { name: '❓ Pertanyaan', value: trunc(question, 1024) },
        { name: '💬 Jawaban', value: trunc(response, 2048) },
      )
      .setFooter({ text: `Ditanya sama ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
