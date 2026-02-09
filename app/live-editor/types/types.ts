export interface PageFormData {
  slug: string;
  TitleAr: string;
  TitleEn: string;
  DescriptionAr: string;
  DescriptionEn: string;
  KeywordsAr: string;
  KeywordsEn: string;
  Author: string;
  AuthorEn: string;
  Robots: string;
  RobotsEn: string;
  "og:title": string;
  "og:description": string;
  "og:keywords": string;
  "og:author": string;
  "og:robots": string;
  "og:url": string;
  "og:image": string;
  "og:type": string;
  "og:locale": string;
  "og:locale:alternate": string;
  "og:site_name": string;
  "og:image:width": string;
  "og:image:height": string;
  "og:image:type": string;
  "og:image:alt": string;
}

export interface PageSeoData {
  TitleAr?: string;
  TitleEn?: string;
  DescriptionAr?: string;
  DescriptionEn?: string;
  KeywordsAr?: string;
  KeywordsEn?: string;
  Author?: string;
  AuthorEn?: string;
  Robots?: string;
  RobotsEn?: string;
  "og:title"?: string;
  "og:description"?: string;
  "og:keywords"?: string;
  "og:author"?: string;
  "og:robots"?: string;
  "og:url"?: string;
  "og:image"?: string;
  "og:type"?: string;
  "og:locale"?: string;
  "og:locale:alternate"?: string;
  "og:site_name"?: string;
  "og:image:width"?: string | null;
  "og:image:height"?: string | null;
  "og:image:type"?: string | null;
  "og:image:alt"?: string;
}

export interface Page {
  slug: string;
  name?: string;
  path: string;
  isStatic?: boolean;
  seo?: PageSeoData;
}

export interface AddPageDialogProps {
  onPageCreated?: (pageSlug: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface EditorNavBarProps {
  showArrowTooltip: boolean;
}
