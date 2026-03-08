const SectionDivider = () => {
  return (
    <div className="w-full border-t border-b border-border overflow-hidden">
      <div className="flex w-full h-3">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-3 h-3 border-r border-border"
          />
        ))}
      </div>
    </div>
  );
};

export default SectionDivider;
