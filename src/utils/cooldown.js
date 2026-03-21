// Per-command cooldown overrides (in seconds)
const COMMAND_COOLDOWNS = {
  ask: 3, chat: 3,
  roast: 10, 'roast-me': 8, 'roast-custom': 10,
  marah: 8, rant: 10, komplain: 8,
  meme: 5, 'meme-random': 5, 'caption-meme': 5,
  joke: 5, motivasi: 5, fakta: 5,
  ping: 2, clear: 15,
  'yt-subscribe': 20, 'yt-unsubscribe': 10, 'yt-check': 30,
};
const DEFAULT_COOLDOWN = 5;

function isOnCooldown(cooldowns, userId, commandName) {
  const key = `${userId}:${commandName}`;
  const last = cooldowns.get(key);
  if (!last) return false;
  const seconds = COMMAND_COOLDOWNS[commandName] ?? DEFAULT_COOLDOWN;
  return (Date.now() - last) / 1000 < seconds;
}

function getRemaining(cooldowns, userId, commandName) {
  const key = `${userId}:${commandName}`;
  const last = cooldowns.get(key);
  if (!last) return 0;
  const seconds = COMMAND_COOLDOWNS[commandName] ?? DEFAULT_COOLDOWN;
  return Math.max(0, seconds - Math.floor((Date.now() - last) / 1000));
}

function setCooldown(cooldowns, userId, commandName) {
  cooldowns.set(`${userId}:${commandName}`, Date.now());
}

module.exports = { isOnCooldown, getRemaining, setCooldown };
