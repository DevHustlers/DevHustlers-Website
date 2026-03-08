const SectionDivider = () => {
  return (
    <div className="w-full border-t border-b border-border px-3 sm:px-6 lg:px-0">
      <div className="lg:max-w-5xl lg:mx-auto overflow-hidden">
        <div className="flex w-full h-8">
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-8 h-8 border-r border-border"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
