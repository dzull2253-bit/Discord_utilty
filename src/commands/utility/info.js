const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const { version: nodeVersion } = process;
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('ℹ️ Informasi lengkap tentang AI Bot!'),

  async execute(interaction) {
    const client = interaction.client;
    const uptime = process.uptime();
    const hours   = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

    const embed = new EmbedBuilder()
      .setColor(0x00C896)
      .setTitle('ℹ️ Informasi AI Bot')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '🤖 Nama',        value: client.user.tag,           inline: true },
        { name: '📦 Versi',       value: '2.0.0',                   inline: true },
        { name: '🌐 Guilds',      value: `${client.guilds.cache.size}`, inline: true },
        { name: '⚙️ Framework',   value: `Discord.js v${djsVersion}`, inline: true },
        { name: '🟢 Node.js',     value: nodeVersion,               inline: true },
        { name: '🧠 AI Engine',    value: 'Groq',            inline: true },
        { name: '🤖 AI Model',    value: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', inline: true },
        { name: '📡 Ping',        value: `${client.ws.ping}ms`,     inline: true },
        { name: '💾 RAM Used',    value: `${memUsed} MB`,           inline: true },
        { name: '⏱️ Uptime',      value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
        { name: '📺 YT Notif',    value: process.env.YOUTUBE_API_KEY ? '✅ Aktif' : '❌ Tidak aktif', inline: true },
        { name: '🖥️ Platform',    value: `${os.type()} ${os.arch()}`, inline: true },
        { name: '📋 Commands',    value: `${client.commands.size} commands`, inline: true },
      )
      .setFooter({ text: 'Kocak Utils • Always Online 24/7 🟢' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
