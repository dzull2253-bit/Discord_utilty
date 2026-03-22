const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ── /ping ─────────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Cek Koneksi Bot'),

  async execute(interaction) {
    const start = Date.now();
    await interaction.deferReply();
    const latency  = Date.now() - start;
    const wsLatency = interaction.client.ws.ping;

    const status =
      latency < 100 ? '🟢 Excellent' :
      latency < 300 ? '🟢 Very Good' :
      latency < 600 ? '🟢 Good' :
      latency < 800 ? ' 🟡 Slow' :
      latency < 1000 ? '🔴 Very Slow' : '❌ Trash';

    const embed = new EmbedBuilder()
      .setColor(latency < 100 ? 0x57F287 : latency < 300 ? 0xFEE75C : 0xED4245)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📊 Status',         value: status,           inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
