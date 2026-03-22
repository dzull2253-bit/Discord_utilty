const { SlashCommandBuilder } = require("discord.js");
const { setGuild, removeGuild } = require("../../services/memeService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme-auto")
    .setDescription("Toggle auto meme")
    .addStringOption(opt =>
      opt.setName("mode")
        .setDescription("on / off")
        .setRequired(true)
        .addChoices(
          { name: "ON", value: "on" },
          { name: "OFF", value: "off" }
        )
    ),

  async execute(interaction) {
    const mode = interaction.options.getString("mode");
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    if (mode === "on") {
      setGuild(guildId, channelId);
      return interaction.reply({
        content: "✅ Auto meme AKTIF di channel ini",
        ephemeral: true
      });
    }

    if (mode === "off") {
      removeGuild(guildId);
      return interaction.reply({
        content: "❌ Auto meme DIMATIKAN",
        ephemeral: true
      });
    }
  }
};
