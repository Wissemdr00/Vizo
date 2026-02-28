"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

const vizoPlans = [
  {
    name: "Free",
    description: "Explore Vizo with basic AI analytics",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: "20 AI queries / month", included: true },
      { text: "2 data sources", included: true },
      { text: "1 workspace", included: true },
      { text: "5 MB file uploads", included: true },
      { text: "Code execution", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth/sign-up",
    popular: false,
  },
  {
    name: "Starter",
    description: "For individuals who need more power",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      { text: "200 AI queries / month", included: true },
      { text: "10 data sources", included: true },
      { text: "5 workspaces", included: true },
      { text: "25 MB file uploads", included: true },
      { text: "Code execution", included: true },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    href: "/auth/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    description: "For power users and growing teams",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      { text: "1,000 AI queries / month", included: true },
      { text: "50 data sources", included: true },
      { text: "20 workspaces", included: true },
      { text: "100 MB file uploads", included: true },
      { text: "Code execution", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Started",
    href: "/auth/sign-up",
    popular: true,
  },
  {
    name: "Team",
    description: "For teams that need unlimited analytics",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { text: "5,000 AI queries / month", included: true },
      { text: "Unlimited data sources", included: true },
      { text: "Unlimited workspaces", included: true },
      { text: "500 MB file uploads", included: true },
      { text: "Code execution", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const MonthlyAnnualPricing = () => {
  const [isAnnually, setIsAnnually] = useState(false);

  return (
    <div className="relative py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary font-medium mb-4">Simple, Transparent Pricing</p>
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            AI-powered analytics for every team
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Upgrade when you need more power. No hidden fees.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex h-12 items-center rounded-md bg-muted p-1 text-lg">
            <RadioGroup
              defaultValue="monthly"
              className="h-full grid-cols-2"
              onValueChange={(value) => {
                setIsAnnually(value === "annually");
              }}
            >
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white dark:has-[button[data-state="checked"]]:bg-zinc-900'>
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="monthly"
                  className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Monthly
                </Label>
              </div>
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white dark:has-[button[data-state="checked"]]:bg-zinc-900'>
                <RadioGroupItem
                  value="annually"
                  id="annually"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="annually"
                  className="flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Yearly
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-100 px-1.5 text-green-600 dark:bg-green-900/20 dark:border-green-900"
                  >
                    -20%
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="mt-8 md:mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {vizoPlans.map((plan) => {
            const price = plan.monthlyPrice === 0
              ? "Free"
              : isAnnually
                ? Math.round(plan.yearlyPrice / 12)
                : plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5 flex flex-col p-6 md:p-8 ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    {price === "Free" ? (
                      <span className="text-5xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold">
                          <span className="text-3xl">$</span>
                          {price}
                        </span>
                        <span className="ml-1 text-muted-foreground">/mo</span>
                        {isAnnually && (
                          <p className="mt-1 text-xs text-green-600">
                            ${plan.yearlyPrice}/yr — save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <ul role="list" className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="size-4 text-primary shrink-0" />
                        ) : (
                          <X className="size-4 text-muted-foreground/40 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-muted-foreground"
                              : "text-muted-foreground/50 line-through"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnnualPricing;
