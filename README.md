#  (JavaScript)

Bot Discord AI serbaguna berbasis **Node.js + Discord.js v14** dengan fitur lengkap: AI Asisten, AI Roasting, AI Mode Marah, AI Meme Generator, dan Notifikasi YouTube otomatis.

---

## ✨ Fitur Lengkap

### 🧠 AI Asisten (OpenAI GPT)
| Command | Deskripsi |
|---------|-----------|
| `/ask [pertanyaan]` | Tanya apapun ke AI |
| `/chat [pesan]` | Chat dengan memory percakapan |
| `/joke` | AI buat joke lucu Indonesia |
| `/motivasi` | Kata motivasi powerful |
| `/fakta [topik]` | Fakta mengejutkan random |
| `/reset-chat` | Hapus history percakapan |
| `@NexusAI [pesan]` | Mention bot untuk chat langsung |

### 🔥 AI Roasting
| Command | Deskripsi |
|---------|-----------|
| `/roast @user [level]` | Roast seseorang (ringan/sedang/brutal/sadis) |
| `/roast-me` | Roast diri sendiri — auto brutal! |
| `/roast-custom [deskripsi]` | Roast dari deskripsi kustom |

### 😡 AI Mode Marah
| Command | Deskripsi |
|---------|-----------|
| `/marah [alasan]` | AI ngamuk dramatis! |
| `/rant [topik]` | AI ngomel panjang lebar |
| `/komplain [masalah]` | AI komplain level dewa |

### 😂 AI Meme Generator
| Command | Deskripsi |
|---------|-----------|
| `/meme [template] [topik]` | Generate meme dengan template |
| `/meme-random [topik]` | AI pilih template otomatis |
| `/caption-meme [situasi]` | Buat caption meme |

**Template tersedia:** Drake, Distracted Boyfriend, Expanding Brain, This Is Fine, Uno Reverse, Gru's Plan, Two Buttons, Stonks, Bernie Sanders, Woman Yelling at Cat, Surprised Pikachu, Galaxy Brain, Change My Mind, Always Has Been, Panik Kalm Panik

### 📺 YouTube Notifications
| Command | Deskripsi |
|---------|-----------|
| `/yt-subscribe [channel_id] [#channel]` | Subscribe notifikasi *(Admin)* |
| `/yt-unsubscribe [channel_id]` | Unsubscribe *(Admin)* |
| `/yt-list` | Lihat semua subscription |
| `/yt-check [channel_id]` | Cek info & video terbaru |

Notifikasi otomatis untuk:
- 📹 Video baru diupload
- 🔴 Channel mulai Live
- ⭕ Live stream selesai

### 🛠️ Utilitas
| Command | Deskripsi |
|---------|-----------|
| `/help` | Panduan lengkap |
| `/info` | Info bot (uptime, RAM, ping) |
| `/ping` | Cek latensi bot |
| `/clear [n]` | Hapus 1–100 pesan *(Admin)* |

---

## 🚀 Instalasi & Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/nexusai-discord-bot
cd nexusai-discord-bot
npm install
```

### 2. Konfigurasi .env
```bash
cp .env.example .env
nano .env   # atau buka dengan text editor favorit kamu
```

Isi minimal yang **WAJIB**:
```env
DISCORD_BOT_TOKEN=token_bot_kamu
CLIENT_ID=client_id_bot_kamu
OPENAI_API_KEY=sk-api_key_openai_kamu
```

### 3. Setup Discord Bot

**Buat Bot di Discord Developer Portal:**
1. Buka [discord.com/developers/applications](https://discord.com/developers/applications)
2. Klik **New Application** → beri nama → **Create**
3. Pergi ke tab **Bot** → klik **Add Bot**
4. Aktifkan semua **Privileged Gateway Intents**:
   - ✅ **PRESENCE INTENT**
   - ✅ **SERVER MEMBERS INTENT**
   - ✅ **MESSAGE CONTENT INTENT**
5. Copy **Token** → simpan di `.env` sebagai `DISCORD_BOT_TOKEN`
6. Pergi ke **General Information** → copy **Application ID** → simpan sebagai `CLIENT_ID`

**Invite Bot ke Server:**
1. Pergi ke **OAuth2 → URL Generator**
2. Centang scopes: `bot` + `applications.commands`
3. Centang permissions: `Administrator` (atau pilih manual sesuai kebutuhan)
4. Copy URL → buka di browser → invite ke server

### 4. Deploy Slash Commands
```bash
npm run deploy
```
> Untuk deploy ke guild tertentu (lebih cepat, baik untuk development): isi `GUILD_ID` di `.env`
> Untuk deploy global (butuh ~1 jam): kosongkan `GUILD_ID`

### 5. Jalankan Bot
```bash
npm start          # Production
npm run dev        # Development (auto-restart dengan nodemon)
```

---

## 📺 Setup YouTube API (Opsional)

1. Buka [Google Cloud Console](https://console.developers.google.com)
2. Buat project baru atau pilih yang ada
3. Klik **Enable APIs** → cari **YouTube Data API v3** → Enable
4. Pergi ke **Credentials** → **Create Credentials** → **API Key**
5. Copy key → simpan di `.env` sebagai `YOUTUBE_API_KEY`

**Cara mendapatkan Channel ID YouTube:**
- Pergi ke channel YouTube
- Channel ID ada di URL: `youtube.com/channel/[CHANNEL_ID]`
- Atau gunakan: [commentpicker.com/youtube-channel-id.php](https://commentpicker.com/youtube-channel-id.php)

> ⚠️ Kuota API gratis: **10,000 units/hari**. Setiap pengecekan membutuhkan ~3 unit per channel.

---

## 🐳 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "src/index.js"]
```

```bash
docker build -t nexusai-bot .
docker run -d --name nexusai --env-file .env nexusai-bot
```

---

## 📁 Struktur Project

```
discord-bot-js/
├── src/
│   ├── index.js                    # Entry point — setup client & load modules
│   ├── deploy-commands.js          # Script deploy slash commands
│   ├── commands/
│   │   ├── ai/
│   │   │   ├── ask.js              # /ask
│   │   │   ├── chat.js             # /chat
│   │   │   ├── joke.js             # /joke
│   │   │   ├── motivasi.js         # /motivasi
│   │   │   └── fakta.js            # /fakta
│   │   ├── roast/
│   │   │   ├── roast.js            # /roast
│   │   │   ├── roast-me.js         # /roast-me
│   │   │   └── roast-custom.js     # /roast-custom
│   │   ├── anger/
│   │   │   ├── marah.js            # /marah
│   │   │   ├── rant.js             # /rant
│   │   │   └── komplain.js         # /komplain
│   │   ├── meme/
│   │   │   ├── meme.js             # /meme
│   │   │   ├── meme-random.js      # /meme-random
│   │   │   └── caption-meme.js     # /caption-meme
│   │   ├── youtube/
│   │   │   ├── yt-subscribe.js     # /yt-subscribe
│   │   │   ├── yt-unsubscribe.js   # /yt-unsubscribe
│   │   │   ├── yt-list.js          # /yt-list
│   │   │   └── yt-check.js         # /yt-check
│   │   └── utility/
│   │       ├── help.js             # /help
│   │       ├── info.js             # /info
│   │       ├── ping.js             # /ping
│   │       ├── clear.js            # /clear
│   │       └── reset-chat.js       # /reset-chat
│   ├── events/
│   │   ├── ready.js                # Bot online, scheduler YouTube
│   │   ├── interactionCreate.js    # Handler slash commands + cooldown
│   │   └── messageCreate.js        # Handler mention bot
│   ├── services/
│   │   ├── aiService.js            # OpenAI integration (semua mode AI)
│   │   └── youtubeService.js       # YouTube API integration
│   └── utils/
│       ├── cooldown.js             # Sistem cooldown per command
│       ├── logger.js               # Winston logger
│       └── banner.js               # ASCII banner + embed helpers
├── .env.example                    # Template konfigurasi
├── package.json                    # Dependencies
└── README.md                       # Dokumentasi ini
```

---

## ⚙️ Konfigurasi Lengkap

| Variable | Default | Keterangan |
|----------|---------|------------|
| `DISCORD_BOT_TOKEN` | — | **WAJIB** Token bot |
| `CLIENT_ID` | — | **WAJIB** Application ID |
| `OPENAI_API_KEY` | — | **WAJIB** API Key OpenAI |
| `YOUTUBE_API_KEY` | — | Opsional, untuk fitur YT |
| `GUILD_ID` | — | Opsional, untuk dev mode |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model AI yang digunakan |
| `YT_CHECK_INTERVAL_MINUTES` | `5` | Interval cek YouTube |
| `MAX_YT_SUBSCRIPTIONS` | `10` | Maks subscription per server |
| `MAX_CONTEXT_MESSAGES` | `10` | Panjang memory percakapan |
| `LOG_LEVEL` | `info` | Level logging |

---

## 🛟 Troubleshooting

**Bot online tapi slash command tidak muncul?**
```bash
npm run deploy   # Jalankan ulang deploy
```
Tunggu beberapa menit untuk propagasi global.

**Error: "Used disallowed intents"?**
Aktifkan semua Privileged Intents di Discord Developer Portal → Bot.

**OpenAI error 429 (rate limit)?**
Cek pemakaian di [platform.openai.com/usage](https://platform.openai.com/usage). Upgrade plan jika perlu.

**YouTube notifications tidak jalan?**
- Pastikan `YOUTUBE_API_KEY` sudah diisi
- Cek kuota API di Google Console (gratis 10,000 unit/hari)
- Jalankan `/yt-check [channel_id]` untuk test manual

---

## 📜 License
MIT — bebas digunakan, dimodifikasi, dan didistribusikan!

---

*NexusAI Discord Bot v2.0 • Node.js + Discord.js v14 + OpenAI*
