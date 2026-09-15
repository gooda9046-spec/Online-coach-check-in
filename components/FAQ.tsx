import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/Reveal";

const faqs = [
  {
    question: "Do clients need to pay separately for the app?",
    answer:
      "No. The client mobile app is included in every Forge plan at no extra cost. Your clients download it for free, sign in with an invite from you, and it's automatically connected to your programs and billing.",
  },
  {
    question: "Can I import my existing clients?",
    answer:
      "Yes. You can bulk-import clients from a CSV, or migrate directly from most major coaching platforms and spreadsheets. Our onboarding team can also do a white-glove migration for Studio/Team plans.",
  },
  {
    question: "What wearables and health apps do you support?",
    answer:
      "Forge syncs with Apple Health, Google Fit, and Wear OS out of the box, which covers most Fitbit, Garmin, Samsung, and Whoop data through those platforms. Direct Whoop and Oura integrations are on our roadmap.",
  },
  {
    question: "How does billing and payment collection work?",
    answer:
      "Forge includes built-in payment processing, so you can set up one-time or recurring charges and get paid directly — funds are deposited to your connected bank account on a rolling schedule, with no separate merchant account needed.",
  },
  {
    question: "Is there a limit on programs or templates I can create?",
    answer:
      "No. Every plan includes unlimited workout programs, nutrition plans, and habit templates. Plan tiers are differentiated by active client count and advanced features, not content limits.",
  },
  {
    question: "Can I try Forge before committing to a plan?",
    answer:
      "Yes — every plan starts with a 14-day free trial, no credit card required. You'll have full access to build programs and invite a few clients before deciding if it's the right fit.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-bright">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-surface px-6 sm:px-8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
