const { askAssistant } = require('../services/aiService');
const logger = require('../utils/logger');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;

    const question = message.content
      .replace(`<@${client.user.id}>`, '')
      .replace(`<@!${client.user.id}>`, '')
      .trim();

    if (!question) {
      return message.reply(
        '👋 Halo! Aku **NexusAI**! Ada yang bisa dibantu?\n' +
        'Ketik `/help` untuk lihat semua fitur! 🤖'
      );
    }

    try {
      await message.channel.sendTyping();
      const response = await askAssistant(client.conversations, message.author.id, question);

      // Split if > 2000 chars
      if (response.length <= 1990) {
        await message.reply(response);
      } else {
        const chunks = response.match(/.{1,1990}/gs) ?? [response];
        for (let i = 0; i < chunks.length; i++) {
          const prefix = chunks.length > 1 ? `*(${i+1}/${chunks.length})*\n` : '';
          if (i === 0) await message.reply(prefix + chunks[i]);
          else await message.channel.send(prefix + chunks[i]);
        }
      }
    } catch (err) {
      logger.error('messageCreate AI error:', err.message);
      await message.reply('❌ Maaf, terjadi error. Coba lagi!');
    }
  },
};
