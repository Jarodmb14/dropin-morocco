import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SimpleHeader from "@/components/SimpleHeader";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-6 text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>404</h1>
          <p className="text-xl text-gray-600 mb-8 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Oops! Page not found</p>
          <a 
            href="/" 
            className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide inline-block"
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif',
              backgroundColor: '#E3BFC0'
            }}
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
