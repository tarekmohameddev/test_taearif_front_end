import { Variants } from "framer-motion";

export const listContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      when: "beforeChildren",
    },
  },
};

export const listItem: Variants = {
  hidden: { y: 6, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.18 } },
};

export const categoryExpansionVariants: Variants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};
