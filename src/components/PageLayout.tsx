import { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Vertical guide lines */}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <div className="max-w-5xl mx-auto h-full relative px-3 sm:px-6 lg:px-0">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-border" />
        </div>
      </div>

      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
