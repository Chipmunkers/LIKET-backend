/**
 * @author jochongs
 */
export default () => ({
  naverLogin: {
    clientId: process.env.NAVER_LOGIN_API_CLIENT_ID,
    clientSecret: process.env.NAVER_LOGIN_API_CLIENT_SECRET,
    redirectUrl: process.env.NAVER_LOGIN_REDIRECT_URL,
  },
});
