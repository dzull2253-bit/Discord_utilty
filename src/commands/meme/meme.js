const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const subreddits = [
  "memes",
  "dankmemes",
  "funny",
  "wholesomememes",
  "ProgrammerHumor"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memes")
    .setDescription("Ambil meme random dari Reddit"),

  async execute(interaction) {
    try {
      const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

      const res = await axios.get(`https://meme-api.com/gimme/${subreddit}`);
      const meme = res.data;

      const embed = new EmbedBuilder()
        .setTitle(meme.title || `Meme dari r/${subreddit}`)
        .setURL(meme.postLink)
        .setImage(meme.url)
        .setFooter({ text: `👍 ${meme.ups} | r/${meme.subreddit}` })
        .setColor("Random");

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      interaction.reply("❌ Gagal ambil meme, coba lagi nanti");
    }
  }
};