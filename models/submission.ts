  export interface EnquirySubmission {
    type: "enquiry";
    name: string;
    email: string;
    number: string;
    requirement: string;
    status: string;
  }

  export interface CareerSubmission {
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
  }

  export type Submission = EnquirySubmission | CareerSubmission;
