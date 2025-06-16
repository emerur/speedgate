import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_HASH = "32e58fbahey833349df3383dc910e18ok";

const bot = new Telegraf(BOT_TOKEN);

// /start handler
bot.start(async (ctx) => {
  const reply = `
👋 *Welcome to Limitless Bot!*

Explore the internet with speed, privacy, and control using trusted connection tools.

Please choose an option below to get started:
`;

  await ctx.reply(reply, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📖 How It Works", callback_data: "how_it_works" }],
        [{ text: "🛒 View Plans", callback_data: "view_plans" }],
        [{ text: "🎁 Get Free Access", callback_data: "get_free" }],
        [{ text: "📞 Contact Support", callback_data: "contact_support" }],
      ],
    },
  });
});

// View plans
bot.action("view_plans", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `💼 *Limitless Plans*:

🔹 *Basic* — \$5/month  
   5 access points · 1 location

🔹 *Pro* — \$10/month  
   15 access points · Multi-region

🔹 *Elite* — \$20/month  
   50 access points · Global coverage

All plans include setup support and 24/7 assistance.`,
    { parse_mode: "Markdown" }
  );
});

// How it works
bot.action("how_it_works", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🔧 *How It Works*:

1. Choose a plan  
2. Get your secure access credentials  
3. Plug them into your preferred tools or apps  
4. Enjoy private, stable connectivity

You’ll receive setup instructions instantly after signup.`,
    { parse_mode: "Markdown" }
  );
});

// Get Free Access (Sample)
bot.action("get_free", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🎁 *Your Free Sample Access*:

\`\`\`
Host: 149.56.23.129
Port: 1080
Username: free_trial
Password: tryitnow
\`\`\`

⚠️ This free sample is limited in speed and region.

Unlock full speed and control by tapping *View Plans* above.`,
    { parse_mode: "Markdown" }
  );
});

// Contact support
bot.action("contact_support", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `📞 *Need Help?*

Message our support team directly at:  
👉 @TrevorDev`
  );
});

// Webhook handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    // Webhook setup
    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.VERCEL_URL}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Webhook set to ${webhookUrl}: ${isSet}`);
    }

    // Process updates
    if (query.secret_hash === SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Telegram Bot Error:", error.toString());
  }

  res.status(200).send("OK");
};
