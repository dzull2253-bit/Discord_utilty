const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ── /ping ─────────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Cek latensi bot!'),

  async execute(interaction) {
    const start = Date.now();
    await interaction.deferReply();
    const latency  = Date.now() - start;
    const wsLatency = interaction.client.ws.ping;

    const status =
      latency < 100 ? '🟢 Excellent' :
      latency < 300 ? '🟡 Good' :
      latency < 600 ? '🟠 Slow' : '🔴 Very Laggy';

    const embed = new EmbedBuilder()
      .setColor(latency < 100 ? 0x57F287 : latency < 300 ? 0xFEE75C : 0xED4245)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 WebSocket Ping', value: `${wsLatency}ms`, inline: true },
        { name: '⚡ Response Time',  value: `${latency}ms`,   inline: true },
        { name: '📊 Status',         value: status,           inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
