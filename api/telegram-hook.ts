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
  const channelUrl = "t.me/unlimited_proxie"

  // Welcome message with Markdown formatting
  const reply = `
  🚨 BINARY TRADING INSIDER ACCESS 🚨

FREE for 48 HOURS ONLY:
🔥 Pro Strategies That Work
🔥 Live Market Signal Breakdowns
🔥 Risk Management Masterclass

📈 JOIN 12,000+ TRADERS LEARNING:
👉 [Tap Here for Instant Access](${channelUrl})

⚠️ WARNING: Trading involves 100% risk of loss. This is education only - we never guarantee profits.

💎 FIRST 200 GET:
✅ "The 5-Minute Profit System" (PDF)
✅ Exclusive webinar invite

"The market rewards the educated - are you in or out?"
🔗 [Tap to Join Now](${channelUrl})
`;

  try {
    await ctx.reply(reply, {
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🚀 Tap Here for Instant Access Now!",
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
