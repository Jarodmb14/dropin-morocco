import MoroccanBackground from "@/components/MoroccanBackground";
import SimpleHeader from "@/components/SimpleHeader";

const QRScanner = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
      <SimpleHeader />
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            QR Scanner
          </h1>
          <p className="text-gray-600 font-medium mb-8 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            This is a placeholder for the QR scanning feature. We will enable the camera-based scanner next. For now, you can continue testing the owner dashboard and customer app.
          </p>
          <div className="bg-white shadow-lg border border-gray-200 p-8">
            <div className="text-gray-900 font-bold mb-4 text-lg uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Coming soon</div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Camera permission prompt</li>
              <li className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Live QR detection</li>
              <li className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Automatic booking validation</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QRScanner;
