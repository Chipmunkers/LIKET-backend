/**
 * @author jochongs
 */
export default () => ({
  appleLogin: {
    clientId: process.env.APPLE_LOGIN_CLIENT_ID,
    teamId: process.env.APPLE_LOGIN_TEAM_ID,
    redirectUrl: process.env.APPLE_LOGIN_REDIRECT_URL,
    keyId: process.env.APPLE_LOGIN_KEY_ID,
    privateKeyString: process.env.APPLE_LOGIN_PRIVATE_KEY_STRING,
  },
});
