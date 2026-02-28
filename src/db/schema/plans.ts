import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const quotaSchema = z.object({
  monthlyAiQueries: z.number().default(50),
  maxDataSources: z.number().default(3),
  maxWorkspaces: z.number().default(1),
  maxFileUploadSizeMb: z.number().default(10),
  codeExecution: z.boolean().default(false),
  prioritySupport: z.boolean().default(false),
});

export type Quotas = z.infer<typeof quotaSchema>;

export const defaultQuotas: Quotas = {
  monthlyAiQueries: 20,
  maxDataSources: 2,
  maxWorkspaces: 1,
  maxFileUploadSizeMb: 5,
  codeExecution: false,
  prioritySupport: false,
};

export const plans = pgTable("plans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  codename: text("codename").unique(),
  default: boolean("default").default(false),

  requiredCouponCount: integer("requiredCouponCount").default(0), // For LTD plans: Number of coupons required to redeem the plan

  hasOnetimePricing: boolean("hasOnetimePricing").default(false),
  hasMonthlyPricing: boolean("hasMonthlyPricing").default(false),
  hasYearlyPricing: boolean("hasYearlyPricing").default(false),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),

  monthlyPrice: integer("monthlyPrice"),
  monthlyPriceAnchor: integer("monthlyPriceAnchor"),
  monthlyStripePriceId: text("monthlyStripePriceId"),
  monthlyLemonSqueezyVariantId: text("monthlyLemonSqueezyVariantId"),
  monthlyDodoProductId: text("monthlyDodoProductId"),
  monthlyPaddlePriceId: text("monthlyPaddlePriceId"),
  // Paypal plan id
  monthlyPaypalPlanId: text("monthlyPaypalPlanId"),

  yearlyPrice: integer("yearlyPrice"),
  yearlyPriceAnchor: integer("yearlyPriceAnchor"),
  yearlyStripePriceId: text("yearlyStripePriceId"),
  yearlyLemonSqueezyVariantId: text("yearlyLemonSqueezyVariantId"),
  yearlyDodoProductId: text("yearlyDodoProductId"),
  yearlyPaddlePriceId: text("yearlyPaddlePriceId"),
  yearlyPaypalPlanId: text("yearlyPaypalPlanId"),
  
  onetimePrice: integer("onetimePrice"),
  onetimePriceAnchor: integer("onetimePriceAnchor"),
  onetimeStripePriceId: text("onetimeStripePriceId"),
  onetimeLemonSqueezyVariantId: text("onetimeLemonSqueezyVariantId"),
  onetimeDodoProductId: text("onetimeDodoProductId"),
  onetimePaddlePriceId: text("onetimePaddlePriceId"),
  onetimePaypalPlanId: text("onetimePaypalPlanId"), // Not Required, Added for standardization
  
  quotas: jsonb("quotas").$type<Quotas>(),
});
