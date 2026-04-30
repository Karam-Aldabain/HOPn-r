import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::page.page", ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;

    const items = await strapi.entityService.findMany("api::page.page", {
      filters: { slug },
      publicationState: "live",
      populate: ["sections", "og_image"],
      limit: 1,
    });

    const entity = Array.isArray(items) ? items[0] : null;
    return this.transformResponse(entity ?? null);
  },
}));
