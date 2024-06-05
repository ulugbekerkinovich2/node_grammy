const { Bot } = require("grammy");
const cyrillicToLatin = require("cyrillic-to-latin");

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new Bot("6297432745:AAFdMAjOBQ1dLmctwhuQj4zgVkzolCKac9o");

bot.command("start", (ctx) => {
  ctx.reply(
    "Xush kelibsiz! Bu bot matnni kirill va lotin alifbolari oʻrtasida oʻzgartira oladi. Lotin alifbosiga o‘tkazish uchun kirill alifbosida xabar yuboring yoki kirill alifbosiga o‘tkazish uchun lotin tilida xabar yuboring."
  );
});

// Function to detect if the text is Cyrillic
const isCyrillic = (text) => {
  return /[А-Яа-яЁё]/.test(text);
};

// Improved custom function to convert Latin to Cyrillic
const latinToCyrillic = (text) => {
  const map = {
    ch: "ч",
    sh: "ш",
    yo: "ё",
    yu: "ю",
    ya: "я",
    ts: "ц",
    a: "а",
    b: "б",
    d: "д",
    e: "е",
    f: "ф",
    g: "г",
    h: "ҳ",
    i: "и",
    j: "ж",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    q: "қ",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    v: "в",
    x: "х",
    y: "й",
    z: "з",
    "o'": "ў",
    "g'": "ғ",
  };

  return text.replace(/ch|sh|yo|yu|ya|ts|o'|g'|[a-z]/gi, function (char) {
    return map[char.toLowerCase()] || char;
  });
};

// Handle text messages
bot.on("message:text", (ctx) => {
  const text = ctx.message.text;
  if (isCyrillic(text)) {
    const convertedText = cyrillicToLatin(text);
    ctx.reply(
      `Original: ${text}\nLotin tiliga aylantirilgan: ${convertedText}`
    );
  } else {
    const convertedText = latinToCyrillic(text);
    ctx.reply(
      `Original: ${text}\nKirill alifbosiga aylantirilgan: ${convertedText}`
    );
  }
});

// Start the bot and handle potential webhook issues
bot.start({
  onStart: () => {
    console.log("Bot started successfully");
  },
  onStop: () => {
    console.log("Bot stopped");
  },
  onError: (err) => {
    console.error("Error starting the bot:", err);
    if (err.error_code === 404 && err.description.includes("deleteWebhook")) {
      bot.start();
    }
  },
});
