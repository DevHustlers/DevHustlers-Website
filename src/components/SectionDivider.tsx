const SectionDivider = () => {
  return (
    <div className="w-full border-t border-b border-border overflow-hidden">
      <div className="max-w-5xl mx-auto flex w-full h-6">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-6 h-6 border-r border-border"
          />
        ))}
      </div>
    </div>
  );
};

export default SectionDivider;
