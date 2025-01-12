/**
 * @author jochongs
 */
export default () => ({
  discord: {
    errorWebhookUrl: process.env.DISCORD_ERROR_BOT_WEBHOOK_URL,
    contentsWebhookUrl: process.env.DISCORD_CONTENTS_BOT_WEBHOOK_URL,
  },
});
