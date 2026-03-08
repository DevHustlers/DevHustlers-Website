import { ReactNode } from "react";

/**
 * PageLayout provides consistent vertical guide lines and content alignment.
 * 
 * The guide lines sit at: px-3 (mobile) / px-6 (sm-md tablet) / max-w-5xl edges (lg+)
 * 
 * ALL child sections using max-w-5xl should NOT add their own horizontal padding
 * at the outermost wrapper level — the guide lines define the boundary.
 * For inner text content, use px-6 sm:px-10 inside the max-w-5xl container.
 */
const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Vertical guide lines — visible on all screen sizes */}
      <div className="fixed inset-0 pointer-events-none z-[60] px-3 sm:px-6 lg:px-0">
        <div className="lg:max-w-5xl lg:mx-auto h-full relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-border" />
        </div>
      </div>

      {/* Page content — same margins as the guide lines */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
