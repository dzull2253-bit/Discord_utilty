const { ActivityType } = require('discord.js');
const cron = require('node-cron');
const logger = require('../utils/logger');
const { checkAllSubscriptions } = require('../services/youtubeService');

const ACTIVITIES = [
  { type: ActivityType.Watching, name: '🤖 AI Assistant | /help' },
  { type: ActivityType.Playing,  name: '🔥 Roasting everyone | /roast' },
  { type: ActivityType.Listening, name: '😡 Getting angry | /marah' },
  { type: ActivityType.Watching, name: '😂 Making memes | /meme' },
  { type: ActivityType.Watching, name: '📺 YouTube Notif | /yt-subscribe' },
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

    // Rotating presence
    client.user.setPresence({ activities: [ACTIVITIES[0]], status: 'online' });
    setInterval(() => {
      actIdx = (actIdx + 1) % ACTIVITIES.length;
      client.user.setPresence({ activities: [ACTIVITIES[actIdx]], status: 'online' });
    }, 30_000);

    // YouTube notification scheduler
    if (process.env.YOUTUBE_API_KEY) {
      const interval = process.env.YT_CHECK_INTERVAL_MINUTES ?? '5';
      // Run every N minutes
      cron.schedule(`*/${interval} * * * *`, async () => {
        try {
          await checkAllSubscriptions(client);
        } catch (err) {
          logger.error('YT check error:', err.message);
        }
      });
      logger.info(`📺 YouTube scheduler started (every ${interval} min)`);
    } else {
      logger.warn('⚠️  YOUTUBE_API_KEY not set. YouTube notifications disabled.');
    }
  },
};
