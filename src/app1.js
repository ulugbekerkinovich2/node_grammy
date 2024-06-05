const { Bot, InputFile } = require("grammy");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const QrCodeReader = require("qrcode-reader");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your bot's token
const token = "6297432745:AAFdMAjOBQ1dLmctwhuQj4zgVkzolCKac9o";
const bot = new Bot(token);

bot.on("message:text", async (ctx) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(ctx.message.text);
    const buffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");
    await ctx.replyWithPhoto(new InputFile(buffer), {
      caption: "Here is your QR code!",
    });
  } catch (err) {
    await ctx.reply("Error generating QR code.");
  }
});

bot.on("message:photo", async (ctx) => {
  try {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const file = await bot.api.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    const image = await Jimp.read(fileUrl);
    const qrBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    const qrCodeReader = new QrCodeReader();
    qrCodeReader.callback = async (error, result) => {
      if (error) {
        await ctx.reply("Failed to read QR code.");
      } else {
        await ctx.reply(`Message from QR: ${result.result}`);
      }
    };

    const qrImage = await Jimp.read(qrBuffer);
    const qrBitmap = qrImage.bitmap;
    qrCodeReader.decode({
      data: qrBitmap.data,
      width: qrBitmap.width,
      height: qrBitmap.height,
    });
  } catch (err) {
    console.log(err);
    await ctx.reply("Failed to read QR code.");
  }
});

bot.start();

console.log("Bot started...");
