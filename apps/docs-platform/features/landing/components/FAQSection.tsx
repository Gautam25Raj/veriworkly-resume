import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@veriworkly/ui";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection = ({ faqs }: FAQSectionProps) => {
  return (
    <section className="space-y-8" aria-labelledby="faq-heading">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="space-y-3 lg:sticky lg:top-24">
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            Questions
          </p>

          <h2
            id="faq-heading"
            className="text-foreground text-3xl font-semibold tracking-tight"
          >
            Docs FAQ
          </h2>

          <p className="text-muted text-sm leading-7 md:text-base">
            Everything you need to know about building with VeriWorkly, our security model, and
            API usage.
          </p>
        </div>

        <Accordion type="single" collapsible className="gap-3">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
