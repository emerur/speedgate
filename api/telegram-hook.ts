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

Explore a curated list of free VPN tools and residential proxy services to help you browse privately and access region-restricted content.

🔐 Secure your connection  
🌍 Discover proxy tools  
📘 Learn how to use them safely

_Disclaimer: This bot is for educational purposes only. We do not promote or support illegal activity. Please use responsibly and follow your local laws._

Choose an option below to begin:
`;

  await ctx.reply(reply, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔎 Learn How It Works", callback_data: "how_it_works" }],
        [{ text: "🌍 Browse VPN & Proxy Tools", callback_data: "view_tools" }],
        [{ text: "🎁 Get a Free Sample Proxy", callback_data: "get_free" }],
        [{ text: "📬 Talk to Support", callback_data: "contact_support" }],
      ],
    },
  });
});

// How it works
bot.action("how_it_works", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `📘 *How It Works*:

1. Browse our curated list of VPN and proxy tools.
2. Choose the tools that suit your needs (speed, country, anonymity).
3. Follow the usage instructions provided.
4. Stay secure and access blocked content safely.

Always use these tools responsibly and legally.`,
    { parse_mode: "Markdown" }
  );
});

// View tools
bot.action("view_tools", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🌐 *Free VPN & Proxy Tools*:

🔸 ProtonVPN (https://protonvpn.com/free-vpn)  
🔸 Psiphon (https://psiphon3.com)  
🔸 Windscribe Free (https://windscribe.com)  
🔸 Urban VPN (https://www.urban-vpn.com/)  
🔸 Hide.me (https://hide.me/en/)  

Note: We do not own or operate these services. Use at your discretion.`,
    { parse_mode: "Markdown" }
  );
});

// Get Free Sample Proxy
bot.action("get_free", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🎁 *Sample SOCKS5 Proxy for Testing:*  

\`\`\`
Host: 149.56.23.129
Port: 1080
Username: free_trial
Password: tryitnow
\`\`\`

⚠️ This is for educational/demo use only. Performance may vary.

To find better tools, tap *Browse VPN & Proxy Tools*.`,
    { parse_mode: "Markdown" }
  );
});

// Contact support
bot.action("contact_support", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `📬 *Need Assistance?*

Reach out to our team directly:  
👉 @TrevorDev`
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
