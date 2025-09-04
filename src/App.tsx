import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import APITestSimple from "./pages/APITestSimple";
import BusinessRulesTest from "./pages/BusinessRulesTest";
import VenueBrowsing from "./pages/VenueBrowsing";
import VenueBrowsingSimple from "./pages/VenueBrowsingSimple";
import VenueMap from "./pages/VenueMap";
import VenueMapSimple from "./pages/VenueMapSimple";
import VenueMapAirbnb from "./pages/VenueMapAirbnb";
import TestPage from "./pages/TestPage";
import BookingFlow from "./pages/BookingFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api-test" element={<APITestSimple />} />
          <Route path="/business-rules-test" element={<BusinessRulesTest />} />
          <Route path="/venues" element={<VenueMapAirbnb />} />
          <Route path="/booking/:venueId" element={<BookingFlow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
