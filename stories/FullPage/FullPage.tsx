"use client";

import { Header } from "../Header";
import { HeroBanner } from "../HeroBanner";
import { EssenceSection } from "../EssenceSection";
import { CreativityTriadSection } from "../CreativityTriadSection";
import { CommitmentSection } from "../CommitmentSection";
import { PhilosophyCtaSection } from "../PhilosophyCtaSection";
import { QuoteSection } from "../QuoteSection";
import { FeaturesSection } from "../FeaturesSection";
import { JourneySection } from "../JourneySection";
import { LandInvestmentFormSection } from "../LandInvestmentFormSection";
import { ProjectsHeader } from "../ProjectsHeader/ProjectsHeader";
import { ProjectsShowcase } from "../ProjectsShowcase/ProjectsShowcase";
import { ValuesSection } from "../ValuesSection/ValuesSection";
import { ContactForm } from "../ContactForm/ContactForm";
import { Footer } from "../Footer";

export interface FullPageProps {
  dir?: "rtl" | "ltr";
  onContactSubmit?: (data: FormData) => void;
}

/** Full page composition with all theme sections and design default text styles */
export const FullPage = ({
  dir = "rtl",
  onContactSubmit,
}: FullPageProps) => (
  <div className="relative">
    <Header
      navLinkTextProps={{ fontWeight: 700 }}
      languageToggleTextProps={{
        fontSize: "1.25rem",
        fontWeight: 700,
        textTransform: "uppercase",
      }}
      ctaTextProps={{ fontSize: "0.875rem", fontWeight: 700 }}
    />
    <HeroBanner
      dir={dir}
      titleTextProps={{
        color: "#deae6d",
        fontSize: "4.5rem",
        fontWeight: 400,
      }}
      subtitleTextProps={{
        color: "#fff",
        fontSize: "3rem",
        fontWeight: 700,
      }}
      descriptionTextProps={{
        color: "#fff",
        fontSize: "1.125rem",
        lineHeight: "1.6",
        maxWidth: "36rem",
      }}
    />
    <EssenceSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi whitespace-pre-line lg:flex-1",
        color: "#d09260",
        fontSize: "40px",
        fontWeight: 700,
      }}
      leadTextProps={{ className: "mb-4 block", fontWeight: 700 }}
      bodyTextProps={{ className: "mt-12 text-lg lg:mt-0", fontSize: "1.125rem" }}
    />
    <CreativityTriadSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi mb-4",
        color: "#B17A4B",
        fontSize: "2.25rem",
        fontWeight: 700,
      }}
      cardTitleTextProps={{
        fontSize: "1.875rem",
        fontWeight: 700,
        color: "#fff",
      }}
      cardDescriptionTextProps={{ lineHeight: "1.75rem", color: "#fff" }}
    />
    <CommitmentSection
      dir={dir}
      roleLabelTextProps={{
        className: "block text-sm",
        fontSize: "0.875rem",
        color: "#fff",
      }}
      nameTextProps={{
        className: "block text-sm",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "#fff",
      }}
      headingTextProps={{
        className: "font-saudi",
        color: "#d09260",
        fontSize: "40px",
        fontWeight: 700,
      }}
      quoteTextProps={{
        className: "quote mt-5 block text-lg",
        fontSize: "1.125rem",
        fontStyle: "italic",
      }}
    />
    <PhilosophyCtaSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi whitespace-pre-line",
        color: "#fff",
        fontSize: "3rem",
        fontWeight: 700,
      }}
      descriptionTextProps={{ className: "mt-3.5", color: "#fff" }}
      ctaTextProps={{
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "#fff",
      }}
    />
    <QuoteSection
      dir={dir}
      quoteTextProps={{
        className: "font-saudi grow text-2xl font-medium xl:text-3xl xl:leading-9",
      }}
      nameTextProps={{ fontWeight: 700, color: "#4F4F4F" }}
      roleTextProps={{ color: "#4F4F4F" }}
    />
    <FeaturesSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi text-4xl font-bold xl:text-5xl text-center",
      }}
      featureTitleTextProps={{
        className: "text-xl font-bold",
        color: "#383838",
      }}
      featureDescriptionTextProps={{
        className: "text-sm leading-7",
        color: "#686868",
      }}
    />
    <JourneySection
      dir={dir}
      headingTextProps={{
        className: "font-saudi text-4xl font-bold xl:text-5xl whitespace-pre-line text-white",
      }}
    />
    <LandInvestmentFormSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi text-4xl font-bold xl:text-5xl",
      }}
      descriptionTextProps={{ className: "text-lg" }}
    />
    <ProjectsHeader
      dir={dir}
      headingTextProps={{
        className: "font-saudi",
        color: "#d09260",
        fontSize: "40px",
        lineHeight: "2.75rem",
        fontWeight: 700,
      }}
      descriptionTextProps={{
        fontSize: "1.125rem",
        color: "#1a1a2e",
        className: "mt-5",
      }}
    />
    <ProjectsShowcase
      dir={dir}
      filterButtonTextProps={{ fontSize: "0.875rem", fontWeight: 500 }}
      statusBadgeTextProps={{ fontSize: "14px" }}
      projectTitleTextProps={{
        className: "font-saudi",
        fontSize: "2.25rem",
        fontWeight: 700,
        lineClamp: 1,
      }}
      projectDescriptionTextProps={{ lineClamp: 2, className: "mt-8" }}
      unitTypeTextProps={{ fontSize: "0.75rem" }}
      ctaTextProps={{ fontSize: "0.875rem", fontWeight: 500 }}
    />
    <ValuesSection
      dir={dir}
      headingTextProps={{
        className: "font-saudi lg:text-center",
        color: "#b28966",
        fontSize: "40px",
        fontWeight: 700,
      }}
      descriptionTextProps={{ fontSize: "1.125rem", maxWidth: "50%" }}
      cardTitleTextProps={{
        fontSize: "1.125rem",
        fontWeight: 700,
        color: "#fff",
      }}
      cardDescriptionTextProps={{ fontSize: "1.125rem", color: "#fff" }}
    />
    <ContactForm
      dir={dir}
      onSubmit={onContactSubmit}
      headingTextProps={{
        className: "font-saudi",
        fontSize: "3rem",
        lineHeight: "131%",
        fontWeight: 700,
      }}
      descriptionTextProps={{
        fontWeight: 700,
        className: "pt-11 lg:py-6",
      }}
    />
    <Footer
      dir={dir}
      addressLabelTextProps={{ fontWeight: 700 }}
      addressValueTextProps={{ lineHeight: "1.25rem" }}
      linksHeadingTextProps={{ fontWeight: 700 }}
      socialHeadingTextProps={{ fontWeight: 700 }}
    />
  </div>
);
