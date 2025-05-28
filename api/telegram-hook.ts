import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Replace with your bot token
const SECRET_HASH = "32e58fbahey833349df3383dc910e180"; // Replace with your own secret hash
//api.telegram.org/bot{token}/setWebhook?url={url}/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180
//api.telegram.org/bot{token}/setWebhook?url=https://mobile-proxies.vercel.app/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const { message } = ctx;
  const channelUrl = "t.me/hq_proxies"

  // Welcome message with Markdown formatting
  const reply = `
  🔥 Supercharge Your Proxy Power — 100% FREE! 🔥
Say goodbye to limits. Get instant access to Residential Socks5 & Mobile Proxies — no trials, no payments, just pure performance.

🌍 30M+ Verified Clean IPs — zero fraud, zero hassle
📍 Pinpoint Geo-Targeting — rule any region, anytime
⚡ Blazing 4G Speeds — fast, stable, unstoppable
🖥️ RDPs Launching Soon — your next-level toolkit is coming

🚀 Don’t wait. Join the channel now:
🔗 [Tap to join Mobile Proxies](${channelUrl})
`;

  try {
    await ctx.reply(reply, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🚀 Join Mobile Proxies Channel Now!",
          url: channelUrl
        },
      ],
    ],
  },
});
    console.log(`Reply to ${COMMAND} command sent successfully.`);
  } catch (error) {
    console.error(`Something went wrong with the ${COMMAND} command:`, error);
  }
}

// Register the /start command handler
bot.command("start", async (ctx) => {
  await handleStartCommand(ctx);
});

// API route handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    // Set webhook if requested
    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.VERCEL_URL}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    // Handle incoming updates from Telegram
    if (query.secret_hash == SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Error handling Telegram update:", error.toString());
  }

  // Acknowledge the request with Telegram
  res.status(200).send("OK");
};
