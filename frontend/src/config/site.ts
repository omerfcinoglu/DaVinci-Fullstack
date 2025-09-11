import { enTexts } from "@/i18n/en";
import { ILayout } from "@/interfaces/ILayout";

export type SiteConfig = typeof siteConfig;

export const siteConfig: ILayout = {
  name: enTexts.site.name,
  description: enTexts.site.description,
  navItems: enTexts.nav,
  navMenuItems: [],
  links: {
    github: "/",
    twitter: "/",
    docs: "/",
  },
};
