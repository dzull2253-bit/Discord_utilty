const { isOnCooldown, getRemaining, setCooldown } = require('../utils/cooldown');
const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      logger.warn(`Unknown command: ${interaction.commandName}`);
      return interaction.reply({ content: '❓ Command tidak dikenal!', ephemeral: true });
    }

    // Cooldown check
    if (isOnCooldown(client.cooldowns, interaction.user.id, interaction.commandName)) {
      const rem = getRemaining(client.cooldowns, interaction.user.id, interaction.commandName);
      return interaction.reply({
        content: `⏳ Sabar dulu! Cooldown **${rem} detik** lagi sebelum bisa pakai \`/${interaction.commandName}\`.`,
        ephemeral: true,
      });
    }
    setCooldown(client.cooldowns, interaction.user.id, interaction.commandName);

    logger.info(`/${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name ?? 'DM'}`);

    try {
      await command.execute(interaction, client);
    } catch (err) {
      logger.error(`Error executing /${interaction.commandName}:`, err);
      const msg = { content: '❌ Terjadi error! Coba lagi atau hubungi admin.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    }
  },
};
