import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::site-setting.site-setting",
  ({ strapi }) => ({
    async findPublic(ctx) {
      const entity = await strapi.entityService.findMany(
        "api::site-setting.site-setting",
        {
          publicationState: "live",
          populate: ["logo", "favicon"],
        }
      );

      const record = Array.isArray(entity) ? entity[0] : entity;
      return this.transformResponse(record ?? null);
    },
  })
);
