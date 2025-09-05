import { useState } from "react";
import MoroccanBackground from "@/components/MoroccanBackground";
import SimpleHeader from "@/components/SimpleHeader";
import FakeQR from "@/components/FakeQR";

const GymBooking = () => {
  const [status, setStatus] = useState<"PENDING" | "PAID">("PENDING");
  const [orderId] = useState<string>(() => `ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Booking
          </h1>
          <div className="text-gray-600 font-medium mb-8 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order: {orderId}</div>

          <div className="bg-white shadow-lg border border-gray-200 p-8">
            {status === "PENDING" && (
              <div className="space-y-6">
                <div className="font-bold text-gray-900 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Status: PENDING</div>
                <p className="text-gray-600 font-medium text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Press Pay to simulate a successful payment. You will receive your access QR.</p>
                <button
                  onClick={() => setStatus("PAID")}
                  className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    backgroundColor: '#E3BFC0'
                  }}
                >
                  Pay Now
                </button>
              </div>
            )}

            {status === "PAID" && (
              <div className="space-y-6">
                <div className="font-bold text-green-600 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Status: PAID ✅</div>
                <p className="text-gray-600 font-medium text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Show this QR at the club entrance to check-in.</p>
                <div className="flex justify-center"><FakeQR value={orderId} /></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GymBooking;
