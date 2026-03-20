const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateRoastMe, generateRoast } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

// ── /roast-me ─────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast-me')
    .setDescription('🎯 Minta AI roast dirimu sendiri! (Mode auto-brutal)'),

  async execute(interaction) {
    await interaction.deferReply();
    const roast = await generateRoastMe(interaction.user.username);

    const embed = new EmbedBuilder()
      .setColor(0xFF0064)
      .setTitle('🎯 ROAST DIRI SENDIRI! 💀')
      .setDescription(trunc(roast))
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: `${interaction.user.username} minta dibakar sendiri 🔥` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
