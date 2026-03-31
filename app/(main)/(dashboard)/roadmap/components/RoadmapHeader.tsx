const RoadmapHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <h1 className="text-foreground text-3xl font-bold md:text-5xl">
        {title}
      </h1>

      <p className="text-muted max-w-3xl text-base md:text-lg">{description}</p>
    </div>
  );
};

export default RoadmapHeader;
