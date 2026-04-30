export default {
  routes: [
    {
      method: "GET",
      path: "/pages/slug/:slug",
      handler: "page.findBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
