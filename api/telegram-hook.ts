import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN; // Replace with your bot token
///api.telegram.org/bot{token}/setWebhook?url={url}/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180
//api.telegram.org/bot{token}setWebhook?url=https://mobile-proxies.vercel.app/api/telegram-hook?secret_hash=32e58fbahey833349df3383dc910e180

const bot = new Telegraf(BOT_TOKEN);

// Handle the /start command
export async function handleStartCommand(ctx) {
  const COMMAND = "/start";
  const channelUrl = "t.me/speedgateproxy";
  const targetUrl = "t.me/+uaTdpo6wLCJmZmVk";

  // Welcome message with Markdown formatting
  const reply = `
Money making methods for FREE!

Tired of wasting time on fake money-making promises? We're offering you 100% FREE access to real, effective strategies for generating income. Whether you're new or experienced, our clear, step-by-step guides will help you succeed.

Inside, you'll find:

• Proven Methods for Bank Logs, CashApp, & PayPal
• Detailed Transfer Walkthroughs
• Clone, Dump, & PIN Techniques
• Giveaways

Plus, all methods are completely FREE!. Start your journey to financial freedom today!

🔗 [Tap Here To Join](${targetUrl})
`;

  try {
    await ctx.reply(reply, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Join Proxies & VPNs Channel",
              url: channelUrl,
            },
          ]
        ],
      },
    });
    console.log(`Reply to ${COMMAND} command sent successfully.`);
  } catch (error) {
    console.error(`Something went wrong with the ${COMMAND} command:`, error);
  }
}
export async function sendImageCommand(ctx) {
  const media = [
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/speedgate/main/photo_2025-08-11_17-14-18.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/speedgate/blob/main/photo_2025-08-11_17-14-26.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/speedgate/blob/main/photo_2025-08-11_17-14-31.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/speedgate/blob/main/photo_2025-08-11_17-14-35.jpg",
    },
    {
      type: "photo",
      media:
        "https://raw.githubusercontent.com/emerur/speedgate/blob/main/photo_2025-08-11_17-14-38.jpg",
    },
    
  ];
  // Send image first
  await ctx.replyWithMediaGroup(media);
}

// Register the /start command handler
bot.command("start", async (ctx) => {
  // Send image first
  await sendImageCommand(ctx);
  await handleStartCommand(ctx);
});

// Webhook handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.WEBHOOK_URL}`;
      const success = await bot.telegram.setWebhook(webhookUrl);
      // console.log("Webchook set:", webhookUrl, success);
      return res.status(200).send("OK");
    }

    await bot.handleUpdate(body);
    return res.status(200).send("OK");
  } catch (err) {
    return res.json({ error: "Internal server error" }, { status: 500 });
  }

  // res.status(200).send("OK");
};
