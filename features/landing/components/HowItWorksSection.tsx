import { Card } from "@veriworkly/ui";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Start with your master profile containing all your information - experience, skills, and more.",
    },
    {
      number: "02",
      title: "Choose Templates",
      description:
        "Select from our collection of professionally designed resume templates to match your style.",
    },
    {
      number: "03",
      title: "Customize & Refine",
      description:
        "Tailor colors, fonts, sections, and layout to create a unique resume that stands out.",
    },
    {
      number: "04",
      title: "Export & Share",
      description:
        "Download as PDF or share directly with employers. All changes stay private on your device.",
    },
  ];

  return (
    <section className="space-y-8" aria-labelledby="how-it-works-heading">
      <div className="space-y-2">
        <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
          Process
        </p>

        <h2
          id="how-it-works-heading"
          className="text-foreground text-3xl font-semibold tracking-tight"
        >
          How to create a resume online
        </h2>

        <p className="text-muted -mt-1 text-base leading-7">
          Start with your master profile to create and manage your resume
          details...
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="flex flex-col justify-between space-y-4 p-6"
          >
            <p className="text-accent text-2xl font-bold">{step.number}</p>
            <h3 className="text-foreground text-lg font-semibold">
              {step.title}
            </h3>
            <p className="text-muted text-sm leading-6">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
