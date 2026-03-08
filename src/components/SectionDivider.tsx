const SectionDivider = () => {
  return (
    <div className="w-full border-t border-b border-border">
      <div className="max-w-5xl mx-auto overflow-hidden">
        <div className="flex w-full h-12">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-12 h-12 border-r border-border"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
