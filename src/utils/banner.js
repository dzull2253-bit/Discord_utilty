const { EmbedBuilder } = require('discord.js');

function printBanner() {
  console.log('\n');
  console.log('  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ █████╗ ██╗');
  console.log('  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔══██╗██║');
  console.log('  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗███████║██║');
  console.log('  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║██╔══██║██║');
  console.log('  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║██║  ██║██║');
  console.log('  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝');
  console.log('');
  console.log('  🤖 NexusAI Discord Bot v2.0.0 — Powered by Discord.js + OpenAI');
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ── Embed Helpers ─────────────────────────────────────────────────────────────
function successEmbed(title, desc) {
  return new EmbedBuilder().setColor(0x57F287).setTitle(`✅ ${title}`).setDescription(desc).setTimestamp();
}

function errorEmbed(title, desc) {
  return new EmbedBuilder().setColor(0xED4245).setTitle(`❌ ${title}`).setDescription(desc).setTimestamp();
}

function infoEmbed(title, desc) {
  return new EmbedBuilder().setColor(0x5865F2).setTitle(`ℹ️ ${title}`).setDescription(desc).setTimestamp();
}

function warnEmbed(title, desc) {
  return new EmbedBuilder().setColor(0xFEE75C).setTitle(`⚠️ ${title}`).setDescription(desc).setTimestamp();
}

// Truncate text for embed limits
function trunc(text, max = 4000) {
  if (!text) return '*(tidak ada respons)*';
  return text.length <= max ? text : text.slice(0, max - 3) + '...';
}

module.exports = { printBanner, successEmbed, errorEmbed, infoEmbed, warnEmbed, trunc };
