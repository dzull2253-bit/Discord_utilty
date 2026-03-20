const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateRoast, generateRoastMe } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

// ── /roast ────────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('🔥 AI akan me-roast seseorang dengan BRUTAL!')
    .addUserOption(o => o.setName('target').setDescription('Target roasting').setRequired(true))
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
    const target = interaction.options.getUser('target');
    const level  = interaction.options.getString('level') ?? 'sedang';

    // Roast yourself if targeting self
    if (target.id === interaction.user.id) {
      await interaction.deferReply();
      const roast = await generateRoastMe(target.username);
      return interaction.editReply({
        content: `${target}, kamu minta di-roast sendiri? Baiklah... 🤣`,
        embeds: [buildRoastEmbed(roast, target, interaction.user, level)],
      });
    }

    await interaction.deferReply();
    const member = interaction.guild?.members.cache.get(target.id);
    const desc   = member?.displayName ?? target.username;
    const roast  = await generateRoast(target.username, desc, level);

    await interaction.editReply({
      content: `${target.toString()} kena roast nih! 🔥`,
      embeds: [buildRoastEmbed(roast, target, interaction.user, level)],
    });
  },
};

function buildRoastEmbed(roast, target, requester, level) {
  const levelEmoji = { ringan: '😊', sedang: '🌶️', brutal: '🔥', sadis: '💀' };
  return new EmbedBuilder()
    .setColor(0xFF4500)
    .setTitle('🔥 ROAST TIME! 🔥')
    .setDescription(trunc(roast))
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: '🎯 Target', value: target.toString(), inline: true },
      { name: '😈 Roaster', value: requester.toString(), inline: true },
      { name: '🌡️ Level', value: `${levelEmoji[level] ?? '🔥'} ${level.toUpperCase()}`, inline: true },
    )
    .setFooter({ text: 'Powered by RoastMaster9000 • Ini cuma hiburan! 😂' })
    .setTimestamp();
}
