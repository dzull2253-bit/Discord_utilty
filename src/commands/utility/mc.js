const { SlashCommandBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc')
    .setDescription('Cek server Minecraft')
    .addSubcommand(sub =>
      sub.setName('status').setDescription('Status server'))
    .addSubcommand(sub =>
      sub.setName('ip').setDescription('IP server'))
    .addSubcommand(sub =>
      sub.setName('online').setDescription('Jumlah player')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    const HOST = "kocak.playserver.pro"; // ganti ini
    const PORT = 21710;

    try {
      if (sub === 'status') {
        const res = await util.status(HOST, PORT);
        return interaction.reply(`🟢 Online (${res.players.online}/${res.players.max})`);
      }

      if (sub === 'ip') {
        return interaction.reply(`🌐 IP: ${HOST}:${PORT}`);
      }

      if (sub === 'online') {
        const res = await util.status(HOST, PORT);
        return interaction.reply(`👥 Player: ${res.players.online}`);
      }

    } catch (err) {
      return interaction.reply("❌ Server offline!");
    }
  }
};
