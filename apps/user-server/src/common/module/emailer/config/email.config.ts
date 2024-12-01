/**
 * @author jochongs
 */
export default () => ({
  email: {
    transport: {
      host: process.env.GMAIL_HOST,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    },
    defaults: {
      from: `"${process.env.GMAIL_USER_NAME}" <${process.env.GMAIL_USER}>`,
    },
  },
});
