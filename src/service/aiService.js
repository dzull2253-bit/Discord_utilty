const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── System Prompts ─────────────────────────────────────────────────────────────
const PROMPTS = {
  assistant: `
Kamu adalah AI Asisten Discord yang cerdas, membantu, dan ramah bernama "NexusAI".
Kamu berbicara dalam Bahasa Indonesia yang natural dan santai tapi tetap informatif.
Gunakan emoji yang relevan untuk membuat percakapan lebih hidup 🤖.
Berikan jawaban yang akurat, detail, dan mudah dipahami.
Untuk pertanyaan teknis (coding, sains, dll), sertakan contoh konkret.
Selalu bersikap positif dan mendukung.`,

  roast: `
Kamu adalah AI ROASTER paling brutal dan kreatif bernama "RoastMaster9000" 🔥.
Tugasmu me-ROAST dengan cara yang sangat kreatif, lucu, dan PEDAS BANGET.

ATURAN ROASTING:
• Fokus pada detail spesifik dari deskripsi target
• Gunakan wordplay, pun, dan analogi tidak terduga
• Roast harus personal dan spesifik, BUKAN generic
• Hindari kata yang benar-benar menyakitkan / rasis / SARA
• Level BRUTAL = sangat pedas tapi tetap komedi
• Gunakan bahasa gaul Indonesia kekinian (gabut, receh, dll)
• Format: beberapa paragraf mengalir + punch line di akhir 💀
• Tambah emoji api 🔥💀😈 untuk efek dramatis`,

  anger: `
Kamu adalah AI dalam mode SANGAT MARAH bernama "RageBot" 😡.
Ekspresikan kemarahan yang dramatis, hiperbolis, dan over-the-top dalam Bahasa Indonesia.

ATURAN MODE MARAH:
• Tulis kata kunci dalam HURUF KAPITAL!!!
• Gunakan tanda seru banyak-banyak!!!!
• Ekspresi frustrasi teatrikal dan dramatis
• Ngomel panjang dengan alasan yang masuk akal tapi lebay
• Analogi absurd untuk menggambarkan kemarahan
• Emoji kemarahan: 😡🤬💢😤🔥
• Tetap lucu meski marah — jangan benar-benar kasar
• Akhiri dengan monolog villain yang dramatis`,

  meme: `
Kamu adalah AI Meme Generator jenius bernama "MemeGod" 😂.
Buat konten meme yang VIRAL dan LUCU dalam Bahasa Indonesia.

KEMAMPUAN:
• Buat teks untuk berbagai template meme populer
• Pahami budaya internet Indonesia (receh, ngakak, dll)
• Gunakan bahasa gaul: wkwk, lmao, anjir, bestie, dll
• Buat meme relatable kehidupan sehari-hari Indonesia
• Referensikan pop culture, anime, game, trending topics

FORMAT OUTPUT:
🖼️ **Template: [nama template]**

**Panel 1 / Atas:** [teks]
**Panel 2 / Bawah:** [teks]
*(tambah panel jika template punya lebih dari 2)*

📝 *Kenapa ini lucu: [penjelasan singkat]*`,

  complain: `
Kamu adalah AI yang sedang KOMPLAIN LEVEL DEWA bernama "KarmaBot" 😤.
Ekspresikan ketidakpuasan dengan sangat dramatis dan berlebihan.

GAYA KOMPLAIN:
• Lebay dan teatrikal seperti drama korea
• Gunakan hiperbola ekstrem ("SEJUTA TAHUN", "SELURUH GALAKSI", dll)
• Bawa-bawa hal tidak relevan untuk menambah efek dramatis
• Sesekali berteriak dalam caps
• Emoji: 😤😩🤦‍♂️💀🙄`,
};

// ── Main AI Call Function ──────────────────────────────────────────────────────
async function callAI({ systemPrompt, messages, temperature = 0.8, maxTokens = 1024 }) {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });
    return response.choices[0]?.message?.content ?? '❌ AI tidak memberikan respons.';
  } catch (err) {
    logger.error('OpenAI Error:', err.message);
    if (err.status === 401) return '❌ API Key tidak valid! Cek konfigurasi.';
    if (err.status === 429) return '⏳ Rate limit tercapai! Coba lagi sebentar.';
    if (err.status === 500) return '🔧 Server OpenAI bermasalah. Coba lagi!';
    return `❌ Error: ${err.message}`;
  }
}

// ── Exported AI Functions ─────────────────────────────────────────────────────

/**
 * AI Asisten — dengan memory percakapan per user
 */
async function askAssistant(conversations, userId, question) {
  if (!conversations.has(userId)) conversations.set(userId, []);
  const history = conversations.get(userId);

  history.push({ role: 'user', content: question });

  // Keep only last N messages to manage token usage
  const maxHistory = parseInt(process.env.MAX_CONTEXT_MESSAGES ?? '10');
  const trimmed = history.slice(-maxHistory);

  const answer = await callAI({
    systemPrompt: PROMPTS.assistant,
    messages: trimmed,
    temperature: 0.75,
  });

  trimmed.push({ role: 'assistant', content: answer });
  conversations.set(userId, trimmed);
  return answer;
}

/**
 * AI Roasting
 */
async function generateRoast(targetName, targetDesc, level = 'sedang') {
  const levelMap = { ringan: 0.8, sedang: 1.0, brutal: 1.2, sadis: 1.3 };
  const temp = levelMap[level.toLowerCase()] ?? 1.0;

  const prompt = `TARGET: ${targetName}
DESKRIPSI: ${targetDesc || '(tidak ada deskripsi, pakai nama saja)'}
LEVEL: ${level.toUpperCase()}

PANGGANG DIA SEKARANG! Buat roast yang legendary dan epic! Jangan tahan-tahan! 🔥`;

  return callAI({ systemPrompt: PROMPTS.roast, messages: [{ role: 'user', content: prompt }], temperature: temp });
}

/**
 * AI Marah
 */
async function generateAnger(reason) {
  const prompt = `ALASAN MARAH: ${reason}\n\nNGAMUK SEKARANG! Tumpahkan semua kemarahan dengan dramatis! JANGAN TAHAN! 😡🤬`;
  return callAI({ systemPrompt: PROMPTS.anger, messages: [{ role: 'user', content: prompt }], temperature: 1.1 });
}

/**
 * AI Rant (ngomel panjang)
 */
async function generateRant(topic) {
  const prompt = `TOPIK RANT: ${topic}\n\nNGOMEL PANJANG LEBAR! Minimal 3-4 paragraf penuh emosi dan drama! 🤬`;
  return callAI({ systemPrompt: PROMPTS.anger, messages: [{ role: 'user', content: prompt }], temperature: 1.1, maxTokens: 1500 });
}

/**
 * AI Komplain
 */
async function generateComplain(problem) {
  const prompt = `MASALAH: ${problem}\n\nKOMPLAIN DENGAN SANGAT DRAMATIS DAN LEBAY! Jadikan ini epic! 😤`;
  return callAI({ systemPrompt: PROMPTS.complain, messages: [{ role: 'user', content: prompt }], temperature: 1.1 });
}

/**
 * AI Meme
 */
async function generateMeme(template, topic) {
  const prompt = `Buat meme menggunakan template "${template}" dengan topik: ${topic}`;
  return callAI({ systemPrompt: PROMPTS.meme, messages: [{ role: 'user', content: prompt }], temperature: 0.95 });
}

/**
 * AI Random Meme
 */
async function generateRandomMeme(topic) {
  const prompt = `Pilih template meme yang paling cocok dan buat meme PALING LUCU untuk topik: ${topic}
Pilih dari: Drake, Distracted Boyfriend, Expanding Brain, This Is Fine, Uno Reverse, Gru's Plan, Two Buttons, Stonks, Bernie Sanders, Woman Yelling at Cat, Surprised Pikachu, Galaxy Brain, atau template lain yang relevan.`;
  return callAI({ systemPrompt: PROMPTS.meme, messages: [{ role: 'user', content: prompt }], temperature: 1.0 });
}

/**
 * AI Meme Caption
 */
async function generateMemeCaption(situation) {
  const prompt = `Buat caption meme yang LUCU dan SUPER RELATABLE untuk situasi: ${situation}`;
  return callAI({ systemPrompt: PROMPTS.meme, messages: [{ role: 'user', content: prompt }], temperature: 1.0 });
}

/**
 * Utility AI calls
 */
async function generateJoke() {
  return callAI({
    systemPrompt: PROMPTS.assistant,
    messages: [{ role: 'user', content: 'Buat 1 joke / teka-teki / cerita pendek yang LUCU dan segar dalam Bahasa Indonesia! Yang bikin ngakak!' }],
    temperature: 1.0,
  });
}

async function generateMotivation() {
  return callAI({
    systemPrompt: PROMPTS.assistant,
    messages: [{ role: 'user', content: 'Berikan kata-kata motivasi yang POWERFUL, tidak klise, dan benar-benar bikin semangat membara! Pakai bahasa Indonesia yang keren dan impactful. Bukan motivasi biasa-biasa aja!' }],
    temperature: 0.9,
  });
}

async function generateFact(topic) {
  const q = topic
    ? `Berikan 1 fakta SANGAT mengejutkan dan tidak banyak diketahui tentang: ${topic}. Jelaskan dengan detail yang bikin WOW dan takjub!`
    : 'Berikan 1 fakta random paling mengejutkan dan mind-blowing yang tidak banyak orang tahu! Bikin orang tercengang!';
  return callAI({
    systemPrompt: PROMPTS.assistant,
    messages: [{ role: 'user', content: q }],
    temperature: 0.85,
  });
}

async function generateRoastMe(userName) {
  return generateRoast(userName, `User Discord bernama ${userName} yang minta di-roast sendiri 😂`, 'brutal');
}

module.exports = {
  askAssistant,
  generateRoast,
  generateRoastMe,
  generateAnger,
  generateRant,
  generateComplain,
  generateMeme,
  generateRandomMeme,
  generateMemeCaption,
  generateJoke,
  generateMotivation,
  generateFact,
};
