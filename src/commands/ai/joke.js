const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ai = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

// ── /joke ─────────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('😄 Minta AI buat joke / teka-teki lucu Indonesia!'),

  async execute(interaction) {
    await interaction.deferReply();
    const joke = await ai.generateJoke();
    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('😄 Joke dari NexusAI')
      .setDescription(trunc(joke))
      .setFooter({ text: `Wkwkwk • Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  },
};
