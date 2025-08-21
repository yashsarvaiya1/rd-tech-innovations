export interface NavbarContent {
  logoUrl?: string;
  hidden?: boolean; 
  routesList?: string[];
  contactButton?: string;
}

export interface LandingPageContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  imageUrls?: string[];
}

export interface CompanyMarqueeContent {
  companyLogoUrls?: string[];
  hidden?: boolean; 
}

export interface CompanyBriefContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  tags?: { text1: string; text2: string }[];
}

export interface ServiceOptionsContent {
  title?: string;
  description?: string;
  hidden?: boolean; 
  cards?: { imageUrl: string; text: string; contactButton: string }[];
}

export interface ProjectContent {
  title?: string;
  hidden?: boolean; 
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
  hidden?: boolean; 
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
  hidden?: boolean; 
  description?: string;
  techCategories?: string[];
  tech?: { imageUrl: string; name: string; techCategory: string }[];
}

export interface IndustriesContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  industries?: { iconUrl: string; name: string }[];
}

export interface ContactUsContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  form?: { name: string; email: string; number: string; requirement: string };
}

export interface FooterContent {
  logoUrl?: string;
  hidden?: boolean; 
  address?: string;
  companyEmail?: string;
  text?: string;
  text2?: string;
  socialLinks?: { iconUrl: string; link: string }[];
}

export interface WhyUsContent {
  title?: string;
  hidden?: boolean; 
  tags?: { text1: string; text2: string }[];
  title2?: string;
  description?: string;
  text?: string[];
}

export interface VisionContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  cards?: { title: string; description: string }[];
}

export interface EventsPhotoWallContent {
  title?: string;
  hidden?: boolean; 
  description?: string;
  imageUrls?: string[];
}

export interface CareerContent {
  title?: string;
  hidden?: boolean; 
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
  hidden?: boolean; 
  cards?: {
    title: string;
    experience: string;
    experienceValue: string;
    position: string;
    positionValue: string;
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
