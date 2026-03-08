import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout>
      <Navbar />
      <div className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Page not found</p>
          <Link to="/" className="inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[15px]">
            Return to Home
          </Link>
        </div>
      </div>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default NotFound;
