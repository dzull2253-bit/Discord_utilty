require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('API KEY:', process.env.GROQ_API_KEY ? 'ADA' : 'TIDAK ADA');
console.log('DISCORD TOKEN:', process.env.DISCORD_BOT_TOKEN ? 'ADA' : 'TIDAK ADA');
const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { printBanner } = require('./utils/banner');

// ── Create Discord Client ─────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
});

const axios = require("axios");

  if (!channel) return;

  try {
    const res = await axios.get("https://meme-api.com/gimme");
    channel.send(res.data.url);
  } catch (err) {
    console.log("Error meme:", err);
  }
}, 600000); // 10 menit

// ── Attach Collections ────────────────────────────────────────────────────────
client.commands     = new Collection(); // slash commands
client.cooldowns    = new Collection(); // cooldown tracking
client.conversations = new Collection(); // AI conversation history per user
client.ytSubscriptions = new Collection(); // guild -> [{ channelId, discordChannelId, lastVideoId, isLive }]

// ── Load Commands ─────────────────────────────────────────────────────────────
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
let totalCommands = 0;

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands', folder))
    .filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      totalCommands++;
    } else {
      logger.warn(`⚠️  Command ${file} missing "data" or "execute"`);
    }
  }
}
logger.info(`📦 Loaded ${totalCommands} commands from ${commandFolders.length} categories`);

// ── Load Events ───────────────────────────────────────────────────────────────
const eventFiles = fs
  .readdirSync(path.join(__dirname, 'events'))
  .filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
logger.info(`🎯 Loaded ${eventFiles.length} event listeners`);

// ── Print Banner & Login ──────────────────────────────────────────────────────
printBanner();

client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
  console.error('LOGIN ERROR FULL:', err); // 🔥 ini penting
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on('SIGINT', () => {
  logger.info('👋 Bot shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
});

module.exports = client;
