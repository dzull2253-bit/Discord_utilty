const axios = require('axios');
const { EmbedBuilder, Colors } = require('discord.js');
const logger = require('../utils/logger');

const YT_API = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtNum(n) {
  n = Number(n);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

// ── API Calls ─────────────────────────────────────────────────────────────────
async function fetchChannelInfo(channelId) {
  if (!API_KEY) return null;
  try {
    const { data } = await axios.get(`${YT_API}/channels`, {
      params: { part: 'snippet,statistics', id: channelId, key: API_KEY },
      timeout: 10000,
    });
    const item = data.items?.[0];
    if (!item) return null;
    return {
      channelId,
      name: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.default?.url,
      subscribers: item.statistics.subscriberCount,
      videos: item.statistics.videoCount,
      views: item.statistics.viewCount,
      url: `https://www.youtube.com/channel/${channelId}`,
    };
  } catch (err) {
    logger.error(`YT fetchChannelInfo error: ${err.message}`);
    return null;
  }
}

async function fetchLatestVideo(channelId) {
  if (!API_KEY) return null;
  try {
    const { data } = await axios.get(`${YT_API}/search`, {
      params: { part: 'snippet', channelId, type: 'video', order: 'date', maxResults: 1, key: API_KEY },
      timeout: 10000,
    });
    const item = data.items?.[0];
    if (!item) return null;

    const videoId = item.id.videoId;
    const statsRes = await axios.get(`${YT_API}/videos`, {
      params: { part: 'statistics,contentDetails', id: videoId, key: API_KEY },
      timeout: 10000,
    });
    const stats = statsRes.data.items?.[0]?.statistics ?? {};

    return {
      videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: item.snippet.thumbnails?.high?.url,
      publishedAt: fmtDate(item.snippet.publishedAt),
      views: stats.viewCount ?? 0,
      likes: stats.likeCount ?? 0,
      comments: stats.commentCount ?? 0,
    };
  } catch (err) {
    logger.error(`YT fetchLatestVideo error: ${err.message}`);
    return null;
  }
}

async function fetchLiveStream(channelId) {
  if (!API_KEY) return null;
  try {
    const { data } = await axios.get(`${YT_API}/search`, {
      params: { part: 'snippet', channelId, type: 'video', eventType: 'live', key: API_KEY },
      timeout: 10000,
    });
    const item = data.items?.[0];
    if (!item) return null;
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.high?.url,
    };
  } catch (err) {
    logger.error(`YT fetchLiveStream error: ${err.message}`);
    return null;
  }
}

// ── Embeds ────────────────────────────────────────────────────────────────────
function buildUploadEmbed(channel, video) {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle(`📹 VIDEO BARU! — ${channel.name}`)
    .setDescription(`**${video.title}**`)
    .setImage(video.thumbnail)
    .setThumbnail(channel.thumbnail)
    .addFields(
      { name: '🔗 Tonton Sekarang', value: `[Klik untuk menonton!](${video.url})`, inline: false },
      { name: '👁️ Views', value: fmtNum(video.views), inline: true },
      { name: '❤️ Likes', value: fmtNum(video.likes), inline: true },
      { name: '⏰ Diupload', value: video.publishedAt, inline: true },
    )
    .setFooter({ text: `YouTube Notification • ${channel.name}`, iconURL: channel.thumbnail })
    .setTimestamp();
}

function buildLiveEmbed(channel, stream) {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle(`🔴 LIVE SEKARANG! — ${channel.name}`)
    .setDescription(`**${stream.title}**`)
    .setImage(stream.thumbnail)
    .setThumbnail(channel.thumbnail)
    .addFields(
      { name: '📺 Join Live', value: `[Klik untuk menonton live!](${stream.url})`, inline: false },
    )
    .setFooter({ text: `YouTube Live • ${channel.name}`, iconURL: channel.thumbnail })
    .setTimestamp();
}

function buildStreamEndedEmbed(channel) {
  return new EmbedBuilder()
    .setColor(0x808080)
    .setTitle(`⭕ Stream Selesai — ${channel.name}`)
    .setDescription('Live stream telah berakhir. Terima kasih sudah menonton! 👋')
    .setThumbnail(channel.thumbnail)
    .setFooter({ text: `YouTube Notification • ${channel.name}` })
    .setTimestamp();
}

// ── Subscription Management ───────────────────────────────────────────────────
async function subscribe(ytSubscriptions, guildId, channelId, discordChannelId) {
  if (!API_KEY) return { success: false, msg: '❌ YouTube API Key belum dikonfigurasi! Hubungi admin bot.' };

  const maxSubs = parseInt(process.env.MAX_YT_SUBSCRIPTIONS ?? '10');
  const guildSubs = ytSubscriptions.get(guildId) ?? [];

  if (guildSubs.length >= maxSubs)
    return { success: false, msg: `❌ Batas maksimal subscription server ini adalah **${maxSubs}**!` };

  if (guildSubs.some(s => s.channelId === channelId))
    return { success: false, msg: '⚠️ Channel ini sudah di-subscribe! Gunakan `/yt-unsubscribe` dulu.' };

  const info = await fetchChannelInfo(channelId);
  if (!info) return { success: false, msg: '❌ Channel YouTube tidak ditemukan! Periksa Channel ID.' };

  const video = await fetchLatestVideo(channelId);
  const live  = await fetchLiveStream(channelId);

  guildSubs.push({
    channelId,
    discordChannelId,
    name: info.name,
    thumbnail: info.thumbnail,
    lastVideoId: video?.videoId ?? null,
    isLive: live !== null,
  });
  ytSubscriptions.set(guildId, guildSubs);

  return {
    success: true,
    msg: `✅ Berhasil subscribe ke **${info.name}**!\n` +
         `👥 Subscribers: **${fmtNum(info.subscribers)}**\n` +
         `🎬 Total Videos: **${fmtNum(info.videos)}**\n` +
         `🔔 Notifikasi aktif — akan dikirim ke <#${discordChannelId}>`,
  };
}

function unsubscribe(ytSubscriptions, guildId, channelId) {
  const guildSubs = ytSubscriptions.get(guildId) ?? [];
  const newSubs = guildSubs.filter(s => s.channelId !== channelId);
  if (newSubs.length === guildSubs.length)
    return { success: false, msg: '❌ Channel tersebut tidak ada dalam daftar subscription!' };
  ytSubscriptions.set(guildId, newSubs);
  return { success: true, msg: '✅ Berhasil unsubscribe dari channel YouTube!' };
}

function listSubscriptions(ytSubscriptions, guildId) {
  return ytSubscriptions.get(guildId) ?? [];
}

async function manualCheck(channelId) {
  const [info, video, live] = await Promise.all([
    fetchChannelInfo(channelId),
    fetchLatestVideo(channelId),
    fetchLiveStream(channelId),
  ]);
  if (!info) return null;
  return { info, video, live };
}

// ── Auto-check all subscriptions ─────────────────────────────────────────────
async function checkAllSubscriptions(client) {
  if (!API_KEY) return;

  for (const [guildId, subs] of client.ytSubscriptions.entries()) {
    for (const sub of subs) {
      try {
        const discordChannel = client.channels.cache.get(sub.discordChannelId);
        if (!discordChannel) continue;

        // Check new video
        const video = await fetchLatestVideo(sub.channelId);
        if (video && video.videoId !== sub.lastVideoId) {
          if (sub.lastVideoId !== null) {  // Don't notify on first check
            await discordChannel.send({
              content: `@everyone 🔔 **${sub.name}** baru saja upload video baru!`,
              embeds: [buildUploadEmbed(sub, video)],
            });
            logger.info(`📹 Video notification sent: ${sub.name}`);
          }
          sub.lastVideoId = video.videoId;
        }

        // Check live stream
        const live = await fetchLiveStream(sub.channelId);
        const nowLive = live !== null;

        if (nowLive && !sub.isLive) {
          await discordChannel.send({
            content: `@everyone 🔴 **${sub.name}** sedang LIVE! Jangan ketinggalan!`,
            embeds: [buildLiveEmbed(sub, live)],
          });
          logger.info(`🔴 Live notification sent: ${sub.name}`);
          sub.isLive = true;
        } else if (!nowLive && sub.isLive) {
          await discordChannel.send({ embeds: [buildStreamEndedEmbed(sub)] });
          sub.isLive = false;
        }
      } catch (err) {
        logger.error(`Error checking YT channel ${sub.channelId}: ${err.message}`);
      }
    }
  }
}

module.exports = {
  fetchChannelInfo,
  fetchLatestVideo,
  fetchLiveStream,
  subscribe,
  unsubscribe,
  listSubscriptions,
  manualCheck,
  checkAllSubscriptions,
  fmtNum,
};
