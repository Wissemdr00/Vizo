import { z } from "zod";
import {
  PlanBasedCredits,
  type CreditsConfig,
  type OnRegisterCredits,
} from "./credits";

export const creditTypeSchema = z.enum([
  "ai_query",
  "code_execution",
  // Tip: Add more credit types here
]);

export const creditsConfig: CreditsConfig = {
  ai_query: {
    name: "AI Query Credits",
    currency: "USD",
    minimumAmount: 10,
    slabs: [
      {
        from: 0,
        to: 500,
        pricePerUnit: 0.02,
      },
      {
        from: 500,
        to: 5000,
        pricePerUnit: 0.015,
      },
    ],
  },
  code_execution: {
    name: "Code Execution Credits",
    currency: "USD",
    minimumAmount: 10,
    slabs: [
      {
        from: 0,
        to: 1000,
        pricePerUnit: 0.01,
      },
    ],
  },
};

export const enableCredits = true;

export const onRegisterCredits: OnRegisterCredits = {
  ai_query: {
    amount: 20,
    expiryAfter: 30,
  },
};

export const onPlanChangeCredits: PlanBasedCredits = {
  starter: {
    ai_query: {
      amount: 100,
      expiryAfter: 30,
    },
    code_execution: {
      amount: 50,
      expiryAfter: 30,
    },
  },
  pro: {
    ai_query: {
      amount: 500,
      expiryAfter: 30,
    },
    code_execution: {
      amount: 300,
      expiryAfter: 30,
    },
  },
  team: {
    ai_query: {
      amount: 2000,
      expiryAfter: 30,
    },
    code_execution: {
      amount: 1000,
      expiryAfter: 30,
    },
  },
};
