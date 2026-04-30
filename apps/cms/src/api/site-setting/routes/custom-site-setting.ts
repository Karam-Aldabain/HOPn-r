export default {
  routes: [
    {
      method: "GET",
      path: "/site-setting/public",
      handler: "site-setting.findPublic",
      config: {
        auth: false,
      },
    },
  ],
};
