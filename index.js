const { Client, GatewayIntentBits } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const player = new Player(client);

// تحميل جميع أدوات البحث والتشغيل المعتمدة

client.on("clientReady", () => { 
  console.log(`✅ Bot is online as: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();

  if (content.startsWith("شغل") || content.startsWith("play")) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("ادخل روم صوتي أولاً!");

    const query = content.replace("شغل", "").replace("play", "").trim();
    if (!query) return message.reply("اكتب اسم الأغنية!");

    message.reply("🔎 جاري البحث والتجميع...");

    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          metadata: message,
        },
      });

      return message.channel.send(`🎶 جاري التشغيل: **${track.title}**`);
    } catch (e) {
      console.error(e);
      return message.channel.send("حصل خطأ أثناء التشغيل!");
    }
  }

  if (content === "وقف" || content === "stop") {
    const queue = player.nodes.get(message.guild.id);
    if (queue) queue.delete();
    return message.reply("تم الإيقاف 🛑");
  }
});

client.login(process.env.TOKEN);
