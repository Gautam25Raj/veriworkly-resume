import TemplateFilters from "./TemplateFilters";

type Props = {
  selectedFamily: string;
  selectedLayout: string;
};

const TemplatesHeader = ({ selectedFamily, selectedLayout }: Props) => {
  return (
    <header className="space-y-4">
      <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
        Template Gallery
      </p>

      <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
        Free Resume Templates (ATS-Friendly & Modern)
      </h1>

      <p className="text-muted max-w-2xl text-base leading-7">
        Browse our collection of free resume templates designed to pass ATS
        systems. Choose from modern, professional, and simple layouts - no login
        required.
      </p>

      <TemplateFilters
        selectedFamily={selectedFamily}
        selectedLayout={selectedLayout}
      />
    </header>
  );
};

export default TemplatesHeader;
