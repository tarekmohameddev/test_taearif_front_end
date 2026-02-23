import type { CreativityCard } from "./CreativityTriadSection.types";

export const DEFAULT_HEADING = "ثلاثية الإبداع";

export const DEFAULT_INTRO =
  "نترجم فلسفتنا عبر ثلاث ركائز أساسية تشكل بصمتنا الخاصة:";

export const DEFAULT_CARDS: [CreativityCard, CreativityCard, CreativityCard] = [
  {
    title: "روح المكان",
    description:
      "قبل أن نضع حجراً واحداً، نقرأ روح المكان. مشاريعنا لا تفرض نفسها على محيطها، بل تنبثق منه في حوار متناغم، لتحترم هويته وتصبح امتداداً طبيعياً له.",
    imageSrc: "https://clusters.sa/creativity-1.png",
    imageAlt: "روح المكان",
  },
  {
    title: "نقاء التصميم",
    description:
      "نستلهم من تراثنا جوهره، لا مجرد شكله. البساطة الفاخرة والخطوط النظيفة هي لغتنا، لنخلق مساحات خالدة تحتضن الذوق وترتقي بالأناقة.",
    imageSrc: "https://clusters.sa/creativity-2.png",
    imageAlt: "نقاء التصميم",
  },
  {
    title: "جودة الحياة",
    description:
      "الرفاهية الحقيقية هي جودة التجربة اليومية. نصمم كل تفصيل لخدمة راحة الإنسان، وخلق بيئة متوازنة تعزز الهدوء وتلهم الإبداع.",
    imageSrc: "https://clusters.sa/creativity-3.png",
    imageAlt: "جودة الحياة",
  },
];
