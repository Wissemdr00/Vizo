import { AppConfigPublic } from "./types";

export const appConfig: AppConfigPublic = {
  projectName: "Vizo",
  projectSlug: "vizo",
  keywords: [
    "Vizo",
    "AI Data Analytics",
    "Data Analysis Platform",
    "Chat with Data",
    "SQL AI",
    "Data Visualization",
    "Business Intelligence",
    "Julius AI alternative",
  ],
  description:
    "Vizo is an AI-powered data analytics platform. Connect your data sources, chat with your data, generate charts, and get instant insights.",
  auth: {
    enablePasswordAuth: true,
  },
  legal: {
    address: {
      street: "123 Analytics Ave",
      city: "San Francisco",
      state: "California",
      postalCode: "94105",
      country: "United States",
    },
    email: "hello@vizo.ai",
    phone: "+1 (555) 000-0000",
  },
  social: {
    twitter: "https://twitter.com/vizoai",
    instagram: "https://instagram.com/vizoai",
    linkedin: "https://linkedin.com/company/vizoai",
    facebook: "https://facebook.com/vizoai",
    youtube: "https://youtube.com/@vizoai",
  },
  email: {
    senderName: "Vizo",
    senderEmail: "hello@vizo.ai",
  },
};
