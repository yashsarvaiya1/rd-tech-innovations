import { desc } from "framer-motion/client";

// Base interface for common fields
interface BaseSection {
  hidden?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  priority?: number; // For sitemap priority
}

export interface NavbarContent extends BaseSection {
  logoUrl?: string;
  routesList?: string[];
  contactButton?: string;
  // Enhanced navbar options
  mobileLogoUrl?: string; // Different logo for mobile
  sticky?: boolean; // Control sticky behavior
  backgroundColor?: string; // Custom background color
  textColor?: string; // Custom text color
}

export interface LandingPageContent extends BaseSection {
  title?: string;
  description?: string;
  imageUrls?: string[];
  // Enhanced landing page options
  subtitle?: string;
  ctaPrimary?: { text: string; link: string; };
  ctaSecondary?: { text: string; link: string; };
  backgroundVideo?: string; // Background video URL
  heroType?: 'image' | 'video' | 'gradient'; // Hero section type
  stats?: { value: string; label: string; }[]; // Statistics to display
}

export interface CompanyMarqueeContent extends BaseSection {
  companyLogoUrls?: string[];
  // Enhanced marquee options
  speed?: number; // Animation speed
  direction?: 'left' | 'right'; // Scroll direction
  pauseOnHover?: boolean; // Pause animation on hover
}

export interface CompanyBriefContent extends BaseSection {
  title?: string;
  description?: string;
  tags?: { text1: string; text2: string; }[];
  // Enhanced company brief options
  foundedYear?: string;
  teamSize?: string;
  officeLocations?: string[];
  missionStatement?: string;
  visionStatement?: string;
  imageUrl?: string; // Company image
}

export interface ServiceOptionsContent extends BaseSection {
  title?: string;
  description?: string;
  cards?: { 
    imageUrl: string; 
    text: string; 
    description: string; 
    contactButton: string;
    // Enhanced service card options
    price?: string;
    features?: string[];
    popular?: boolean; // Mark as popular service
    category?: string; // Service category
  }[];
  // Enhanced service options
  displayType?: 'grid' | 'carousel' | 'list'; // Display layout
}

export interface ProjectContent extends BaseSection {
  title?: string;
  text?: string;
  cards?: {
    title: string;
    about: string;
    industryTags: string[];
    techTags: string[];
    links: { name: string; url: string; }[]; // Updated with name and URL
    imageUrl: string;
    // Enhanced project options
    thumbnailUrl?: string; // Thumbnail for preview
    completedDate?: string; // Project completion date
    clientName?: string; // Client name
    projectType?: string; // Type of project
    duration?: string; // Project duration
    teamSize?: number; // Team size for the project
    challenges?: string[]; // Challenges faced
    solutions?: string[]; // Solutions implemented
    results?: string[]; // Project outcomes/results
    featured?: boolean; // Featured project flag
    status?: 'completed' | 'ongoing' | 'planned'; // Project status
  }[];
  // Enhanced project section options
  filterEnabled?: boolean; // Enable/disable filtering
  sortOptions?: string[]; // Available sort options
  itemsPerPage?: number; // Pagination
}

export interface TestimonialContent extends BaseSection {
  title?: string;
  description?: string;
  cards?: {
    name: string;
    designation: string;
    companyName: string;
    imageUrl: string;
    socialLinks: { iconUrl: string; name: string; link: string; }[];
    message: string;
    // Enhanced testimonial options
    rating?: number; // Star rating (1-5)
    projectName?: string; // Related project
    videoTestimonial?: string; // Video testimonial URL
    featured?: boolean; // Featured testimonial
    date?: string; // Testimonial date
  }[];
  // Enhanced testimonial section options
  displayType?: 'cards' | 'carousel' | 'masonry'; // Display layout
  autoplay?: boolean; // Auto-play carousel
  showRating?: boolean; // Show star ratings
}

export interface TechnologiesContent extends BaseSection {
  title?: string;
  description?: string;
  techCategories?: string[];
  tech?: { 
    imageUrl: string; 
    name: string; 
    techCategory: string;
    // Enhanced tech options
    proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
    description?: string; // Technology description
    website?: string; // Official website
    featured?: boolean; // Featured technology
  }[];
  // Enhanced technologies section options
  displayType?: 'grid' | 'category-tabs' | 'slider'; // Display layout
  showProficiency?: boolean; // Show proficiency levels
}

export interface IndustriesContent extends BaseSection {
  title?: string;
  description?: string;
  industries?: { 
    iconUrl: string; 
    name: string;
    // Enhanced industry options
    description?: string; // Industry description
    projectCount?: number; // Number of projects in this industry
    featured?: boolean; // Featured industry
    caseStudyUrl?: string; // Link to case study
  }[];
  // Enhanced industries section options
  displayType?: 'grid' | 'cards' | 'list'; // Display layout
  showProjectCount?: boolean; // Show project counts
}

export interface ContactUsContent extends BaseSection {
  title?: string;
  description?: string;
  form?: { 
    name: string; 
    email: string; 
    number: string; 
    requirement: string;
    // Enhanced form options
    subject?: string; // Email subject field
    company?: string; // Company field
    budget?: string; // Budget field
  };
  // Enhanced contact options
  officeAddress?: string;
  phoneNumbers?: string[];
  emailAddresses?: string[];
  socialLinks?: { iconUrl: string; name: string; link: string; }[];
  mapEmbedUrl?: string; // Google Maps embed URL
  workingHours?: string;
  responseTime?: string; // Expected response time
}

export interface FooterContent extends BaseSection {
  logoUrl?: string;
  address?: string;
  companyEmail?: string;
  text?: string;
  text2?: string;
  socialLinks?: { iconUrl: string; name: string; link: string; }[];
  // Enhanced footer options
  quickLinks?: { name: string; url: string; }[]; // Quick navigation links
  services?: { name: string; url: string; }[]; // Service links
  legalLinks?: { name: string; url: string; }[]; // Legal pages (Privacy, Terms, etc.)
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
  };
  copyrightText?: string;
  businessHours?: string;
  phoneNumber?: string;
}

export interface WhyUsContent extends BaseSection {
  title?: string;
  tags?: { text1: string; text2: string; }[];
  title2?: string;
  description?: string;
  text?: string[];
  // Enhanced why us options
  imageUrl?: string; // Supporting image
  videoUrl?: string; // Supporting video
  achievements?: { icon?: string; title: string; description: string; }[];
  certifications?: { imageUrl: string; name: string; }[];
}

export interface VisionContent extends BaseSection {
  title?: string;
  description?: string;
  cards?: { 
    title: string; 
    description: string;
    // Enhanced vision card options
    iconUrl?: string; // Icon for the vision card
    imageUrl?: string; // Image for the vision card
  }[];
  // Enhanced vision section options
  backgroundImageUrl?: string; // Background image
  displayType?: 'cards' | 'timeline' | 'grid'; // Display layout
}

export interface EventsPhotoWallContent extends BaseSection {
  title?: string;
  description?: string;
  imageUrls?: string[];
  // Enhanced events options
  events?: {
    title: string;
    date: string;
    description?: string;
    imageUrls: string[];
    location?: string;
    attendees?: number;
  }[];
  displayType?: 'masonry' | 'grid' | 'carousel'; // Display layout
  filterByYear?: boolean; // Enable year filtering
}

export interface CareerContent extends BaseSection {
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
    // Enhanced career form options
    experience?: string; // Years of experience
    currentCompany?: string;
    noticePeriod?: string;
    linkedinProfile?: string;
    githubProfile?: string;
    coverLetter?: string;
  };
  // Enhanced career options
  benefits?: string[]; // Company benefits
  workCulture?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
  officeImages?: string[]; // Office photos
  testimonials?: {
    name: string;
    designation: string;
    message: string;
    imageUrl?: string;
  }[]; // Employee testimonials
}

export interface JobOpeningContent extends BaseSection {
  title?: string;
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
    // Enhanced job opening options
    salary?: string; // Salary range
    location?: string; // Job location
    jobType?: 'full-time' | 'part-time' | 'contract' | 'internship'; // Job type
    remote?: boolean; // Remote work option
    department?: string; // Department/team
    applicationDeadline?: string; // Application deadline
    benefits?: string[]; // Job benefits
    companySize?: string; // Company size
    industryType?: string; // Industry type
    urgentHiring?: boolean; // Urgent hiring flag
    featured?: boolean; // Featured job posting
    postedDate?: string; // Job posting date
    applicationCount?: number; // Number of applications received
  }[];
  // Enhanced job opening section options
  filterOptions?: {
    locations?: string[];
    departments?: string[];
    jobTypes?: string[];
    experienceLevels?: string[];
  };
  sortOptions?: string[]; // Available sort options
}

// Enhanced main content interface
export interface Content {
  id: string;
  
  // Existing sections
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
  
  // Global SEO settings
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  
  // Enhanced global settings
  favicon?: string;
  appleTouchIcon?: string;
  manifestUrl?: string; // PWA manifest
  themeColor?: string;
  backgroundColor?: string;
  
  // Analytics and tracking
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
  
  // Site settings
  siteName?: string;
  siteUrl?: string;
  locale?: string;
  language?: string;
  timezone?: string;
  
  // Schema.org structured data
  organizationSchema?: {
    name: string;
    url: string;
    logo: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    contactPoint?: {
      telephone: string;
      contactType: string;
      email?: string;
    };
    sameAs?: string[]; // Social media URLs
  };
  
  // Performance and caching
  cacheSettings?: {
    staticAssets?: number; // Cache duration in seconds
    apiResponses?: number;
    images?: number;
  };
  
  // Feature flags
  features?: {
    animations?: boolean;
    darkMode?: boolean;
    multiLanguage?: boolean;
    chatbot?: boolean;
    cookieConsent?: boolean;
    maintenance?: boolean;
  };
  
  // Content management
  lastUpdated?: string;
  version?: string;
  publishedBy?: string;
  status?: 'draft' | 'published' | 'archived';
}

// Additional interfaces for enhanced functionality
export interface SiteSettings {
  maintenance?: {
    enabled: boolean;
    message?: string;
    allowedIPs?: string[];
  };
  
  notifications?: {
    enabled: boolean;
    messages: {
      id: string;
      type: 'info' | 'warning' | 'success' | 'error';
      message: string;
      dismissible: boolean;
      expiry?: string;
    }[];
  };
  
  redirects?: {
    from: string;
    to: string;
    type: 301 | 302;
  }[];
}

// Export additional types for better TypeScript support
export type SectionKey = keyof Omit<Content, 'id' | 'seoTitle' | 'seoDescription' | 'seoKeywords' | 'ogImage' | 'twitterImage' | 'canonicalUrl' | 'favicon' | 'appleTouchIcon' | 'manifestUrl' | 'themeColor' | 'backgroundColor' | 'googleAnalyticsId' | 'googleTagManagerId' | 'facebookPixelId' | 'hotjarId' | 'siteName' | 'siteUrl' | 'locale' | 'language' | 'timezone' | 'organizationSchema' | 'cacheSettings' | 'features' | 'lastUpdated' | 'version' | 'publishedBy' | 'status'>;

export type DisplayType = 'grid' | 'cards' | 'carousel' | 'list' | 'masonry' | 'timeline' | 'slider' | 'category-tabs';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export type ProjectStatus = 'completed' | 'ongoing' | 'planned';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
