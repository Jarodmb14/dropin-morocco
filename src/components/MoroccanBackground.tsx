import zellige from "@/assets/stickers-zellige-marocain-sans-soudure.jpg.jpg";

interface MoroccanBackgroundProps {
  children: React.ReactNode;
}

const MoroccanBackground = ({ children }: MoroccanBackgroundProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient from light turquoise to sand */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #A8E6E1 0%, #F5E9DD 100%)",
        }}
      />

      {/* Zellige top border (faint) */}
      <div
        className="absolute top-0 left-0 right-0 h-24 opacity-15"
        style={{
          backgroundImage: `url(${zellige})`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top center',
        }}
      />

      {/* Zellige side borders (very faint) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-16 opacity-10"
        style={{
          backgroundImage: `url(${zellige})`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'left top',
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-16 opacity-10"
        style={{
          backgroundImage: `url(${zellige})`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'right top',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MoroccanBackground;
