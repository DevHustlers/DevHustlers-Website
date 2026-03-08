import { forwardRef } from "react";

const SectionDivider = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="w-full border-t border-b border-border">
      <div className="max-w-5xl mx-auto overflow-hidden px-3 sm:px-6 lg:px-0">
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
});

SectionDivider.displayName = "SectionDivider";

export default SectionDivider;
