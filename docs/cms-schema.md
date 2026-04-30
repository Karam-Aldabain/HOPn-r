# CMS Schema + API (Strapi)

This project uses Strapi content-types in `apps/cms/src/api` plus a reusable `Section` component in `apps/cms/src/components/content/section.json`.

## Core Content Types

### Page
- Location: `apps/cms/src/api/page/content-types/page/schema.json`
- Fields: `title`, `slug`, `seo_title`, `seo_description`, `og_image`, `sections[]`
- Sections: repeatable `content.section` component with `type`, `content_json`, `visible`, `order`

API (default Strapi REST):
- `GET /api/pages`
- `GET /api/pages/:id`
- `POST /api/pages`
- `PUT /api/pages/:id`
- `DELETE /api/pages/:id`

Custom:
- `GET /api/pages/slug/:slug` (public)

### Solution
- Location: `apps/cms/src/api/solution/content-types/solution/schema.json`
- Fields: `title`, `description`, `problems[]`, `deliverables[]`, `icon`, `cta_label`, `cta_url`, `visible`, `order`

API:
- `GET /api/solutions`
- `GET /api/solutions/:id`
- `POST /api/solutions`
- `PUT /api/solutions/:id`
- `DELETE /api/solutions/:id`

### Project
- Location: `apps/cms/src/api/project/content-types/project/schema.json`
- Fields: `title`, `short_desc`, `long_desc`, `industry`, `tech_tags[]`, `highlights[]`,
  `cover_image`, `gallery[]`, `featured`, `published`, `order`

API:
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Partner
- Location: `apps/cms/src/api/partner/content-types/partner/schema.json`
- Fields: `name`, `logo`, `url`, `partnership_type`, `description`, `visible`, `order`

API:
- `GET /api/partners`
- `GET /api/partners/:id`
- `POST /api/partners`
- `PUT /api/partners/:id`
- `DELETE /api/partners/:id`

### Team Member
- Location: `apps/cms/src/api/team-member/content-types/team-member/schema.json`
- Fields: `name`, `role`, `photo`, `bio`, `linkedin_url`, `visible`, `order`

API:
- `GET /api/team-members`
- `GET /api/team-members/:id`
- `POST /api/team-members`
- `PUT /api/team-members/:id`
- `DELETE /api/team-members/:id`

### Lead Submission
- Location: `apps/cms/src/api/lead-submission/content-types/lead-submission/schema.json`
- Fields: `name`, `email`, `company`, `topic`, `message`, `consent`, `status`, `notes`

API:
- `GET /api/lead-submissions`
- `GET /api/lead-submissions/:id`
- `POST /api/lead-submissions`
- `PUT /api/lead-submissions/:id`
- `DELETE /api/lead-submissions/:id`

### Navigation
- Location: `apps/cms/src/api/navigation/content-types/navigation/schema.json`
- Fields: `location` (`header` | `footer`), `items_json`

API:
- `GET /api/navigation`
- `GET /api/navigation/:id`
- `POST /api/navigation`
- `PUT /api/navigation/:id`
- `DELETE /api/navigation/:id`

Custom:
- `GET /api/navigation/location/:location` (public)

### Site Setting
- Location: `apps/cms/src/api/site-setting/content-types/site-setting/schema.json`
- Fields: `brand_name`, `logo`, `favicon`, `footer_company_text`, `social_links`,
  `analytics_id`, `legal_imprint`, `legal_privacy`, `legal_cookie`

API:
- `GET /api/site-setting`
- `PUT /api/site-setting`

Custom:
- `GET /api/site-setting/public` (public)

## Notes
- Draft/Publish is enabled for: `page`, `solution`, `project`, `partner`, `team-member`, `navigation`, `site-setting`.
- `lead-submission` is always stored without draft/publish.
- Strapi provides authentication/permissions for all endpoints via the Admin Panel.

## Seed Data
Seed data runs on boot when `SEED=true` is set in the CMS environment.
Seed logic lives in:
- `apps/cms/src/seed/index.ts`
