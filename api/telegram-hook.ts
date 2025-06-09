import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_HASH = "32e58fbahey833349df3383dc910e18ok";

const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const { message } = ctx;
  const channelUrl = "https://t.me/rddpsproxies";

  const reply = `
Welcome to ProxyPal Bot 👋

Here, you can explore a curated list of free VPN tools and residential proxy services to help you browse more privately and access region-restricted content.

🔐 Secure your connection  
🌍 Discover proxy tools  
📘 Learn how to use them safely

Disclaimer: This bot is for educational purposes only. We do not promote or support illegal activity. Please use responsibly and follow your local laws.

To get started, tap the button below:
`;

  try {
    await ctx.reply(reply, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Explore Free VPN Tools",
              url: channelUrl,
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

bot.command("start", async (ctx) => {
  await handleStartCommand(ctx);
});

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.VERCEL_URL}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    if (query.secret_hash == SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Error handling Telegram update:", error.toString());
  }

  res.status(200).send("OK");
};
