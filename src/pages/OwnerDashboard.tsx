import MoroccanBackground from "@/components/MoroccanBackground";
import SimpleHeader from "@/components/SimpleHeader";
import { Link } from "react-router-dom";

const mockHistory = [
  { id: "ORD-1042", customer: "Sara A.", venue: "Atlas Power Gym", date: "2025-09-04", amount: 50, status: "COMPLETED" },
  { id: "ORD-1041", customer: "Youssef M.", venue: "Atlas Power Gym", date: "2025-09-03", amount: 90, status: "COMPLETED" },
  { id: "ORD-1040", customer: "Imane B.", venue: "Atlas Power Gym", date: "2025-09-03", amount: 150, status: "REFUNDED" },
];

const badge = (status: string) => {
  const map: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700 border-green-300",
    REFUNDED: "bg-red-100 text-red-700 border-red-300",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };
  return map[status] || "bg-gray-100 text-gray-700 border-gray-300";
};

const OwnerDashboard = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />

      <section className="py-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Owner Dashboard
              </h1>
              <p className="text-gray-600 font-medium mt-4 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Manage check-ins, scan QR codes, and review history.
              </p>
            </div>
             <div className="flex gap-4">
               <Link 
                 to="/owner/scan" 
                 className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                 style={{ 
                   fontFamily: 'Space Grotesk, sans-serif',
                   backgroundColor: '#E3BFC0'
                 }}
               >
                 Open QR Scanner
               </Link>
               <Link 
                 to="/owner/create-gym" 
                 className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                 style={{ 
                   fontFamily: 'Space Grotesk, sans-serif',
                   backgroundColor: '#BFC0E3'
                 }}
               >
                 Add New Gym
               </Link>
             </div>
          </div>

          {/* History */}
          <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
              <div className="font-bold text-gray-900 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Recent Check-ins</div>
              <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Today • {new Date().toLocaleDateString()}</div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockHistory.map((h) => (
                <div key={h.id} className="px-6 py-6 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{h.venue}</div>
                    <div className="text-sm text-gray-600 font-medium mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{h.customer} • {h.date}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{h.amount} DH</div>
                    <div className={`px-4 py-2 text-xs font-semibold border uppercase tracking-wide ${badge(h.status)}`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{h.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OwnerDashboard;
