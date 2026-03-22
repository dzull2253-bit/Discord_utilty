const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { setChannel, toggleMeme } = require("../../services/memeService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme-auto")
    .setDescription("Atur meme otomatis")
    .addSubcommand(sub =>
      sub.setName("set")
        .setDescription("Set channel meme")
    )
    .addSubcommand(sub =>
      sub.setName("on")
        .setDescription("Aktifkan meme auto")
    )
    .addSubcommand(sub =>
      sub.setName("off")
        .setDescription("Matikan meme auto")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (interaction.options.getSubcommand() === "set") {
      setChannel(guildId, interaction.channel.id);
      return interaction.reply({ content: "✅ Channel meme diset!", ephemeral: true });
    }

    if (interaction.options.getSubcommand() === "on") {
      const ok = toggleMeme(guildId, true);
      if (!ok) return interaction.reply({ content: "❌ Set dulu channel pake /meme-auto set", ephemeral: true });

      return interaction.reply({ content: "✅ Meme auto ON", ephemeral: true });
    }

    if (interaction.options.getSubcommand() === "off") {
      const ok = toggleMeme(guildId, false);
      if (!ok) return interaction.reply({ content: "❌ Set dulu channel pake /meme-auto set", ephemeral: true });

      return interaction.reply({ content: "🛑 Meme auto OFF", ephemeral: true });
    }
  }
};
