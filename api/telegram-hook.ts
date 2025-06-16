import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_HASH = "32e58fbahey833349df3383dc910e18ok";

const bot = new Telegraf(BOT_TOKEN);

// /start handler
bot.start(async (ctx) => {
  const welcomeMessage = `
👋 *Welcome to Limitless Bot!*

Get access to secure, high-speed connection tools designed for performance and privacy.

Choose an option to get started:
  `;

  await ctx.reply(welcomeMessage, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📘 How It Works", callback_data: "how_it_works" }],
        [{ text: "💼 View Access Plans", callback_data: "view_plans" }],
        [{ text: "🎁 Try Free Sample", callback_data: "get_free" }],
        [{ text: "📞 Contact Support", callback_data: "contact_support" }],
      ],
    },
  });
});

// How it works
bot.action("how_it_works", async (ctx) => {
  await ctx.answerCbQuery();
  const howItWorks = `
🔧 *How Limitless Works*:

1. Choose a plan based on your needs  
2. Receive your connection credentials instantly  
3. Use with your preferred apps or tools  
4. Enjoy stable, private, and optimized connectivity

*Simple setup. Full control.*
  `;
  await ctx.reply(howItWorks, { parse_mode: "Markdown" });
});

// View plans
bot.action("view_plans", async (ctx) => {
  await ctx.answerCbQuery();
  const plans = `
💼 *Limitless Access Plans*:

🔹 *Basic* — \$5/month  
   Access to 5 high-speed nodes

🔹 *Pro* — \$10/month  
   15 dynamic locations · Enhanced bandwidth

🔹 *Elite* — \$20/month  
   50+ nodes · Global reach · Priority support

All plans include simple setup guides and 24/7 assistance.
  `;
  await ctx.reply(plans, { parse_mode: "Markdown" });
});

// Free trial
bot.action("get_free", async (ctx) => {
  await ctx.answerCbQuery();
  const freeAccess = `
🎁 *Free Trial Access*:

\`\`\`
Host: 149.56.23.129  
Port: 1080  
Username: demo_user  
Password: limitless
\`\`\`

⚠️ Note: Trial access may have limited speed and availability.

Want full power? Tap *View Access Plans* to upgrade.
  `;
  await ctx.reply(freeAccess, { parse_mode: "Markdown" });
});

// Contact support
bot.action("contact_support", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `📞 *Need Help?*  
Message our support team here: @TrevorDev`
  );
});

// Webhook handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    // Set webhook
    if (query.setWebhook === "true") {
      const webhookUrl = `${process.env.VERCEL_URL}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Webhook set: ${webhookUrl}`);
    }

    // Handle updates
    if (query.secret_hash === SECRET_HASH) {
      await bot.handleUpdate(body);
    }
  } catch (error) {
    console.error("Bot Error:", error);
  }

  res.status(200).send("OK");
};
