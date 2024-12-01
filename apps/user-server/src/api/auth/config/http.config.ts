/**
 * @author jochongs
 */
export default () => ({
  http: {
    timeout: process.env.HTTP_TIMEOUT,
    maxRedirects: process.env.HTTP_MAX_REDIRECTS,
  },
});
