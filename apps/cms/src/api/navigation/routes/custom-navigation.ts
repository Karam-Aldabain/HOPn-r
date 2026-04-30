export default {
  routes: [
    {
      method: "GET",
      path: "/navigation/location/:location",
      handler: "navigation.findByLocation",
      config: {
        auth: false,
      },
    },
  ],
};
