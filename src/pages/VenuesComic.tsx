import { useMemo, useState } from "react";

// Comic-style tier colors
const tierColors: Record<string, { bg: string; text: string; border: string }> = {
  rookie: { bg: "#00C851", text: "#FFFFFF", border: "#00A041" },
  pro: { bg: "#007BFF", text: "#FFFFFF", border: "#0056B3" },
  champion: { bg: "#6F42C1", text: "#FFFFFF", border: "#59359A" },
  legend: { bg: "#DC3545", text: "#FFFFFF", border: "#A71E2A" },
};

// Mock venues
const mockVenues = [
  { id: "1", name: "Atlas Power Gym", city: "Marrakech", tier: "rookie", distanceKm: 1.2, price: 50, amenities: ["weights", "classes"], cover: "src/assets/pexels-postiglioni-943527.jpg" },
  { id: "2", name: "Casablanca Pro Fitness", city: "Casablanca", tier: "pro", distanceKm: 2.7, price: 90, amenities: ["cardio", "sauna"], cover: "src/assets/pexels-mark-neal-201020-3049880.jpg" },
  { id: "3", name: "Rabat Champion Club", city: "Rabat", tier: "champion", distanceKm: 3.4, price: 150, amenities: ["pool", "trainer"], cover: "src/assets/pexels-ryutaro-5472525 (1).jpg" },
  { id: "4", name: "Legend Spa & Strength", city: "Tangier", tier: "legend", distanceKm: 4.1, price: 320, amenities: ["spa", "concierge"], cover: "src/assets/pexels-rasabromeo-2963873-11566277.jpg" },
  { id: "5", name: "Sahara Fit Box", city: "Ouarzazate", tier: "rookie", distanceKm: 0.8, price: 50, amenities: ["boxing", "weights"], cover: "src/assets/pexels-miunal-5518970 (1).jpg" },
  { id: "6", name: "Majorelle Strength Lab", city: "Marrakech", tier: "pro", distanceKm: 1.9, price: 90, amenities: ["cardio", "crossfit"], cover: "src/assets/pexels-uiliamnornberg-24039210 (1).jpg" },
  { id: "7", name: "Royal Champion Arena", city: "Rabat", tier: "champion", distanceKm: 5.2, price: 150, amenities: ["pool", "classes"], cover: "src/assets/pexels-lucia-clavijo-1772565396-28390796.jpg" },
  { id: "8", name: "Legend Marrakech Elite", city: "Marrakech", tier: "legend", distanceKm: 2.2, price: 320, amenities: ["spa", "premium"], cover: "src/assets/pexels-yassine-benmoussa-1650792656-28293177.jpg" },
];

const TIER_LABEL: Record<string, string> = {
  rookie: "Rookie",
  pro: "Pro",
  champion: "Champion",
  legend: "Legend",
};

function VenuesComic() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<string>("");

  const filtered = useMemo(() => {
    return mockVenues.filter((v) => {
      const matchesText = `${v.name} ${v.city}`.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tier ? v.tier === tier : true;
      return matchesText && matchesTier;
    });
  }, [search, tier]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E3BFC0" }}>
      <div className="container mx-auto px-6 py-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-gradient-to-r from-orange-600 via-blue-600 to-purple-600 bg-clip-text">
              Find Your Gym
            </h1>
            <p className="text-gray-700 font-semibold mt-2">Morocco • Nearby • Comic Power 💥</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or city..."
              className="px-4 py-3 rounded-xl bg-white/90 shadow outline-none w-72 border-2 border-orange-300 focus:border-orange-500"
            />
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/90 shadow outline-none border-2 border-blue-300 focus:border-blue-500"
            >
              <option value="">All tiers</option>
              <option value="rookie">Rookie</option>
              <option value="pro">Pro</option>
              <option value="champion">Champion</option>
              <option value="legend">Legend</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((v) => {
            const c = tierColors[v.tier] ?? tierColors.rookie;
            return (
              <div
                key={v.id}
                className="group bg-white/95 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-4"
                style={{ borderColor: c.border }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={v.cover} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    {TIER_LABEL[v.tier]}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold border" style={{ borderColor: c.border, color: c.bg }}>
                    {v.price} DH
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-gray-900">{v.name}</h3>
                    <span className="text-sm font-bold text-gray-600">{v.distanceKm} km</span>
                  </div>
                  <div className="text-gray-700 font-semibold">{v.city}</div>
                  <div className="flex flex-wrap gap-2">
                    {v.amenities.map((a) => (
                      <span key={a} className="text-xs px-3 py-1 rounded-full border bg-white/90" style={{ borderColor: c.border, color: c.bg }}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <button
                    className="w-full mt-2 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 text-white py-3 rounded-xl font-black hover:scale-[1.02] transform transition-all shadow"
                  >
                    BOOK • {v.price} DH
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VenuesComic;
