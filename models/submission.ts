// Update your models/submission.ts
export interface EnquirySubmission {
  id?: string; // ✅ Add optional ID field
  type: "enquiry";
  name: string;
  email: string;
  number: string;
  requirement: string;
  status: string;
  createdAt?: any; // ✅ Add optional created at field
}

export interface CareerSubmission {
  id?: string; // ✅ Add optional ID field
  type: "career";
  name: string;
  email: string;
  number: string;
  location: string;
  portfolioOrLink: string;
  ctc: string;
  about: string;
  resumeUrl: string;
  positions: string[];
  status: string;
  createdAt?: any; // ✅ Add optional created at field
}

export type Submission = EnquirySubmission | CareerSubmission;
