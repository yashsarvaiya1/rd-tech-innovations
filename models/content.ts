export interface NavbarContent {
  logoUrl?: string;
  routesList?: string[];
  contactButton?: string;
}

export interface LandingPageContent {
  title?: string;
  description?: string;
  imageUrls?: string[];
}

export interface CompanyMarqueeContent {
  companyLogoUrls?: string[];
}

export interface CompanyBriefContent {
  title?: string;
  description?: string;
  tags?: { text1: string; text2: string }[];
}

export interface ServiceOptionsContent {
  title?: string;
  description?: string;
  cards?: { imageUrl: string; text: string; contactButton: string }[];
}

export interface ProjectContent {
  title?: string;
  text?: string;
  cards?: {
    title: string;
    about: string;
    industryTags: string[];
    techTags: string[];
    links: string[];
    imageUrl: string;
  }[];
}

export interface TestimonialContent {
  title?: string;
  description?: string;
  cards?: {
    name: string;
    designation: string;
    companyName: string;
    imageUrl: string;
    socialLinks: string[];
    message: string;
  }[];
}

export interface TechnologiesContent {
  title?: string;
  description?: string;
  techCategories?: string[];
  tech?: { imageUrl: string; name: string }[];
}

export interface IndustriesContent {
  title?: string;
  description?: string;
  industries?: { iconUrl: string; name: string }[];
}

export interface ContactUsContent {
  title?: string;
  description?: string;
  form?: { name: string; email: string; number: string; requirement: string };
}

export interface FooterContent {
  logoUrl?: string;
  address?: string;
  companyEmail?: string;
  text?: string;
  socialLinks?: { iconUrl: string; link: string }[];
}

export interface WhyUsContent {
  title?: string;
  tags?: { text1: string; text2: string }[];
  title2?: string;
  description?: string;
  text?: string[];
}

export interface VisionContent {
  title?: string;
  description?: string;
  cards?: { title: string; description: string }[];
}

export interface EventsPhotoWallContent {
  title?: string;
  description?: string;
  imageUrls?: string[];
}

export interface CareerContent {
  title?: string;
  form?: {
    name: string;
    email: string;
    number: string;
    location: string;
    portfolioOrLink: string;
    ctc: string;
    about: string;
    resumeUrl: string;
    positions: string[];
  };
}

export interface JobOpeningContent {
  title?: string;
  cards?: {
    title: string;
    experience: string;
    position: string;
    viewDetailsButton: string;
    requiredSkillsTitle?: string;
    requiredSkills?: string[];
    responsibilityTitle?: string;
    responsibilities?: string[];
  }[];
}

export interface Content {
  id: string;
  navbar?: NavbarContent;
  landingPage?: LandingPageContent;
  companyMarquee?: CompanyMarqueeContent;
  companyBrief?: CompanyBriefContent;
  serviceOptions?: ServiceOptionsContent;
  projects?: ProjectContent;
  testimonials?: TestimonialContent;
  technologies?: TechnologiesContent;
  industries?: IndustriesContent;
  contactUs?: ContactUsContent;
  footer?: FooterContent;
  whyUs?: WhyUsContent;
  vision?: VisionContent;
  eventsPhotoWall?: EventsPhotoWallContent;
  career?: CareerContent;
  jobOpening?: JobOpeningContent;
  seoTitle?: string;
  seoDescription?: string;
}
