const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateMeme } = require('../../services/aiService');
const { trunc } = require('../../utils/banner');

const TEMPLATES = [
  'Drake Pointing', 'Distracted Boyfriend', 'Expanding Brain',
  'This Is Fine', 'Uno Reverse', "Gru's Plan", 'Two Buttons',
  'Stonks', 'Bernie Sanders', 'Woman Yelling at Cat',
  'Surprised Pikachu', 'Galaxy Brain', 'Change My Mind',
  'Always Has Been', 'Panik Kalm Panik',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('😂 Generate meme teks otomatis pakai AI!')
    .addStringOption(o =>
      o.setName('template')
        .setDescription('Template meme yang digunakan')
        .setRequired(true)
        .addChoices(
          ...TEMPLATES.slice(0, 25).map(t => ({ name: t, value: t }))
        ))
    .addStringOption(o =>
      o.setName('topik')
        .setDescription('Topik untuk meme')
        .setRequired(true)
        .setMaxLength(300)),

  async execute(interaction) {
    const template = interaction.options.getString('template');
    const topik    = interaction.options.getString('topik');
    await interaction.deferReply();

    const meme = await generateMeme(template, topik);

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('😂 MEME GENERATOR 9000')
      .setDescription(trunc(meme))
      .addFields(
        { name: '🎭 Template', value: template, inline: true },
        { name: '📌 Topik', value: topik, inline: true },
      )
      .setFooter({ text: 'MemeGod • Dibuat dengan cinta dan kegilaan 🐸' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
