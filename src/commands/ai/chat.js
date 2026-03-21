// chat.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askAssistant } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('💬 Chat dengan AI dalam mode percakapan (konteks tersimpan)')
    .addStringOption(o => o.setName('pesan').setDescription('Pesan kamu').setRequired(true).setMaxLength(1000)),

  async execute(interaction, client) {
    const msg = interaction.options.getString('pesan');
    await interaction.deferReply();

    const response = await askAssistant(client.conversations, interaction.user.id, msg);

    const embed = new EmbedBuilder()
      .setColor(0x39C5BB)
      .setTitle('💬 Chat')
      .addFields(
        { name: '👤 Kamu', value: trunc(msg, 1024) },
        { name: '🤖 Kocak', value: trunc(response, 2048) },
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'Konteks percakapan tersimpan per user' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
