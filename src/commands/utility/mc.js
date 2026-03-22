const { SlashCommandBuilder } = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc')
    .setDescription('Cek server Minecraft')
    .addSubcommand(sub =>
      sub.setName('status').setDescription('Status server'))
    .addSubcommand(sub =>
      sub.setName('info').setDescription('cek info server'))
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
        return interaction.reply(`🟢 Online (${res.players.online} / 100)`);
      }

      if (sub === 'info') {
        return interaction.reply(`**Kocak MC**\n\n🌐 IP: ${HOST}\n 🌐 PORT: ${PORT}\n\n -Survival -One Block\n -Economy -Bank\n -AutoCutTree -Venminer\n -SpesialItem -Weekly Reward`);
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
