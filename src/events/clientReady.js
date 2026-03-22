const { ActivityType } = require('discord.js');
const cron = require('node-cron');
const axios = require('axios');
const logger = require('../utils/logger');
const { checkAllSubscriptions } = require('../services/youtubeService');

const ACTIVITIES = [
  { type: ActivityType.Watching, name: '/help | Kocak Utils' },
];
let actIdx = 0;

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info(`  🟢 Bot ONLINE: ${client.user.tag}`);
    logger.info(`  🌐 Guilds   : ${client.guilds.cache.size}`);
    logger.info(`  👥 Users    : ${client.users.cache.size}`);
    logger.info(`  📦 Commands : ${client.commands.size}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Presence
    client.user.setPresence({ activities: [ACTIVITIES[0]], status: 'online' });
    setInterval(() => {
      actIdx = (actIdx + 1) % ACTIVITIES.length;
      client.user.setPresence({ activities: [ACTIVITIES[actIdx]], status: 'online' });
    }, 30000);

    // ================= YOUTUBE =================
    if (process.env.YOUTUBE_API_KEY) {
      const interval = process.env.YT_CHECK_INTERVAL_MINUTES ?? '5';

      cron.schedule(`*/${interval} * * * *`, async () => {
        try {
          await checkAllSubscriptions(client);
        } catch (err) {
          logger.error('YT check error:', err.message);
        }
      });

      logger.info(`📺 YouTube scheduler started (every ${interval} min)`);
    } else {
      logger.warn('⚠️ YOUTUBE_API_KEY not set. YouTube notifications disabled.');
    }

    // ================= MEME =================
    cron.schedule("0 * * * *", async () => {
      const channel = client.channels.cache.get("1432040919682519264");

      if (!channel) return logger.warn("⚠️ Channel meme gak ketemu");

      try {
        const res = await axios.get("https://meme-api.com/gimme");
        await channel.send(res.data.url);
        logger.info("😂 Meme terkirim");
      } catch (err) {
        logger.error("❌ Meme error:", err.message);
      }
    }, {
      timezone: "Asia/Jakarta"
    });

    logger.info("😂 Meme scheduler started (every 1 hour)");
  },
};
