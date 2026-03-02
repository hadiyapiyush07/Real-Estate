import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

/* ========= FULL LOCATIONS (ALL CITIES & DISTRICTS OF GUJARAT) ========= */
const LOCATIONS = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
  "Junagadh", "Gandhinagar", "Anand", "Nadiad", "Mehsana", "Bharuch",
  "Navsari", "Bhuj", "Porbandar", "Palanpur", "Godhra", "Veraval",
  "Modasa", "Amreli", "Botad", "Chhota Udaipur", "Dahod", "Ahwa",
  "Khambhalia", "Lunavada", "Morbi", "Rajpipla", "Himmatnagar",
  "Surendranagar", "Vyara", "Valsad", "Tharad", "Kutch", "Patan",
  "Sabarkantha", "Tapi", "Aravalli", "Devbhoomi Dwarka", "Gir Somnath",
  "Mahisagar", "Narmada", "Panchmahal", "Vav-Tharad",
  "Banaskantha", "Kheda", "Dang"
].sort();

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Below ₹20L", min: 0, max: 2000000 },
  { label: "₹20L — ₹50L", min: 2000000, max: 5000000 },
  { label: "₹50L — ₹1Cr", min: 5000000, max: 10000000 },
  { label: "Above ₹1Cr", min: 10000000, max: Infinity },
];

const DROPDOWNS = {
  type: [
    "Agricultural",
    "Non-Agricultural",
    "Farm Land",
    "Industrial Plot",
    "Residential Plot",
  ],
  status: ["Active", "On Sale", "Sold", "Under Negotiation"],
  sale: ["Owner", "Broker", "Builder"],
};

export default function BuyTopBar({ onFilterChange }) {

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(null);

  const filtersRef = useRef({
    location: "",
    price: PRICE_RANGES[0],
    type: "",
    status: "",
    sale: "",
  });

  const wrapperRef = useRef();

  /* ========= CLOSE OUTSIDE ========= */

  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(null);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ========= SEND FILTER ========= */

  const updateFilter = (key, value) => {
    filtersRef.current[key] = value;
    onFilterChange(filtersRef.current);
    setOpen(null);
  };

  /* ========= SEARCH ========= */

  const handleSearch = (v) => {
    setQuery(v);

    if (!v) return setSuggestions([]);

    const filtered = LOCATIONS.filter((l) =>
      l.toLowerCase().includes(v.toLowerCase())
    );

    setSuggestions(filtered);
  };

  /* ========= UI ========= */

  const dropdownBtn =
    "flex items-center gap-2 px-4 py-2 border rounded-full bg-white hover:bg-gray-100 whitespace-nowrap shadow-sm";

  const menu =
    "absolute top-12 right-0 w-56 bg-white border rounded-xl shadow-2xl z-[99999]";

  return (
    <div
      ref={wrapperRef}
      className="relative z-[99999] bg-white border-b px-4 py-3 flex flex-wrap gap-3 items-center"
    >

      {/* ========= SEARCH ========= */}

      <div className="relative flex-1 min-w-[260px]">

        <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white">
          <Search size={18} className="mr-2 text-gray-500" />

          <input
            value={query}
            onFocus={() => setOpen(null)}
            onChange={(e) => {
              setOpen(null);
              handleSearch(e.target.value);
            }}
            placeholder="Search locations..."
            className="w-full outline-none bg-transparent"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-2xl z-[99999]">
            {suggestions.map((s) => (
              <div
                key={s}
                onClick={() => {
                  setQuery(s);
                  setSuggestions([]);
                  updateFilter("location", s);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========= PRICE ========= */}

      <div className="relative">
        <button
          onClick={() => setOpen(open === "price" ? null : "price")}
          className={dropdownBtn}
        >
          Price <ChevronDown size={16} />
        </button>

        {open === "price" && (
          <div className={menu}>
            {PRICE_RANGES.map((p) => (
              <div
                key={p.label}
                onClick={() => updateFilter("price", p)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {p.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========= OTHER DROPDOWNS ========= */}

      {Object.entries(DROPDOWNS).map(([key, values]) => (
        <div key={key} className="relative">

          <button
            onClick={() => setOpen(open === key ? null : key)}
            className={dropdownBtn}
          >
            {key === "type"
              ? "Property Type"
              : key === "status"
              ? "Status"
              : "Sale By"}
            <ChevronDown size={16} />
          </button>

          {open === key && (
            <div className={menu}>
              {values.map((v) => (
                <div
                  key={v}
                  onClick={() => updateFilter(key, v)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {v}
                </div>
              ))}
            </div>
          )}

        </div>
      ))}

    </div>
  );
}