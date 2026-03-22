const axios = require("axios");

const subreddits = [
  "memes",
  "dankmemes",
  "funny",
  "wholesomememes",
  "ProgrammerHumor"
];

async function sendRandomMeme(channel) {
  try {
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    const res = await axios.get(`https://meme-api.com/gimme/${subreddit}`);

    await channel.send(res.data.url);
  } catch (err) {
    console.error("Meme error:", err.message);
  }
}

module.exports = { sendRandomMeme };
