import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::navigation.navigation",
  ({ strapi }) => ({
    async findByLocation(ctx) {
      const { location } = ctx.params;

      const items = await strapi.entityService.findMany(
        "api::navigation.navigation",
        {
          filters: { location },
          publicationState: "live",
          limit: 1,
        }
      );

      const entity = Array.isArray(items) ? items[0] : null;
      return this.transformResponse(entity ?? null);
    },
  })
);
