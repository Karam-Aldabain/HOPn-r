import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("pages")
  listPages() {
    return this.publicService.listPages();
  }

  @Get("pages/:slug")
  getPageBySlug(@Param("slug") slug: string) {
    return this.publicService.getPageBySlug(slug);
  }

  @Get("solutions")
  listSolutions(@Query("visible") visible?: string) {
    const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
    return this.publicService.listSolutions(visibleBool);
  }

  @Get("projects")
  listProjects(
    @Query("published") published?: string,
    @Query("featured") featured?: string,
    @Query("industry") industry?: string,
    @Query("tech") tech?: string,
  ) {
    const publishedBool = published === "true" ? true : published === "false" ? false : undefined;
    const featuredBool = featured === "true" ? true : featured === "false" ? false : undefined;
    return this.publicService.listProjects({
      published: publishedBool,
      featured: featuredBool,
      industry,
      tech,
    });
  }

  @Get("partners")
  listPartners(@Query("visible") visible?: string) {
    const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
    return this.publicService.listPartners(visibleBool);
  }

  @Get("partners/settings")
  partnerSettings() {
    return this.publicService.getPartnerSettings();
  }

  @Get("team")
  listTeam(@Query("visible") visible?: string) {
    const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
    return this.publicService.listTeam(visibleBool);
  }

  @Get("navigation")
  listNav() {
    return this.publicService.listNav();
  }

  @Get("settings/public")
  getSetting(@Query("key") key?: string) {
    return this.publicService.getSetting(key);
  }
}
