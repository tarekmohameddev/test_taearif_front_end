import { CommunityIcon } from "../assets/CommunityIcon";
import { HeritageIcon } from "../assets/HeritageIcon";
import { QualityIcon } from "../assets/QualityIcon";
import type { ValueCard } from "./ValuesSection.types";

export const DEFAULT_HEADING = "نحن لا نبني\nبل نُحيي الأماكن";

export const DEFAULT_DESCRIPTION =
  "مهمتنا تتجاوز حدود الخرسانة والزجاج. نحن نرى في كل أرض خالية قصة تنتظر أن تُروى، وفي كل تصميم فرصة لخلق تجربة إنسانية غنية. من اختيار الموقع بعناية، إلى آخر لمسة في التشطيبات، نحن نصمم كل تفصيل لخدمة غاية واحدة: إثراء حياتك";

export const DEFAULT_CARDS: ValueCard[] = [
  {
    title: "المجتمع أولاً",
    description: "مساحات تعزز الترابط الاجتماعي وتناغمها",
    icon: <CommunityIcon />,
    bgVariant: "muted-foreground",
  },
  {
    title: "الأصالة المتجددة",
    description: "استلهام من إرثنا المعماري برؤية عصرية.",
    icon: <HeritageIcon />,
    bgVariant: "darken",
  },
  {
    title: "الجودة كمعيار",
    description: "التزام مطلق بأعلى معايير الجودة في المواد والتنفيذ.",
    icon: <QualityIcon />,
    bgVariant: "black",
  },
];
