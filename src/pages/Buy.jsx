import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BuyTopBar from "../components/BuyTopBar";

/* ===== Fix Marker Icons ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* ===== Gujarat Bounds ===== */
const gujaratBounds = [
  [20.0, 68.0],
  [24.7, 74.5],
];

/* ===== Demo Properties ===== */
const propertiesData = [
  {
    id: 1,
    title: "Agricultural Land",
    location: "Ahmedabad",
    priceNumber: 10000000,
    pricePerUnit: "1.00 Cr",
    unit: "Bigha",
    totalPrice: "1.00 Cr",
    area: "1 Bigha",
    type: "Agricultural",
    coords: [23.0225, 72.5714],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: 2,
    title: "Farm Land",
    location: "Rajkot",
    priceNumber: 115200000,
    pricePerUnit: "96.00 Lakh",
    unit: "Bigha",
    totalPrice: "11.52 Cr",
    area: "12 Bigha",
    type: "Agricultural",
    coords: [22.3039, 70.8022],
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    id: 3,
    title: "Green Field",
    location: "Surat",
    priceNumber: 144000000,
    pricePerUnit: "80.00 Lakh",
    unit: "Bigha",
    totalPrice: "14.40 Cr",
    area: "18 Bigha",
    type: "Agricultural",
    coords: [21.1702, 72.8311],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
];

const Buy = () => {
  const navigate = useNavigate();

  const [filtered, setFiltered] = useState(propertiesData);
  const [selectedCity, setSelectedCity] = useState("");

  /* ========= MAIN FILTER ENGINE ========= */

  const handleFilterChange = (filters) => {
    let result = [...propertiesData];

    // Location filter
    if (filters.location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
      setSelectedCity(filters.location);
    }

    // Price filter
    if (filters.price) {
      result = result.filter(
        (p) =>
          p.priceNumber >= filters.price.min &&
          p.priceNumber <= filters.price.max
      );
    }

    // Property type filter
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    setFiltered(result);
  };

  /* ===== Marker Click Filter ===== */
  const handleMarkerClick = (city) => {
    const result = propertiesData.filter(
      (p) => p.location === city
    );
    setFiltered(result);
    setSelectedCity(city);
  };

  const resetFilter = () => {
    setFiltered(propertiesData);
    setSelectedCity("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">

      {/*  FILTER BAR */}
      <BuyTopBar onFilterChange={handleFilterChange} />

      <div className="flex flex-1 overflow-hidden">

        {/* ================= MAP ================= */}
        <div className="w-1/2 hidden lg:block">
          <MapContainer
            center={[22.7, 71.5]}
            zoom={7}
            minZoom={6}
            maxBounds={gujaratBounds}
            maxBoundsViscosity={1}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {propertiesData.map((p) => (
              <Marker
                key={p.id}
                position={p.coords}
                eventHandlers={{
                  click: () => handleMarkerClick(p.location),
                }}
              >
                <Popup>
                  <b>{p.title}</b>
                  <br />
                  {p.location}, Gujarat
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* ================= LISTINGS ================= */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCity
                ? `${selectedCity} Land Listings`
                : "Gujarat Land Listings"}
            </h2>

            {selectedCity && (
              <button
                onClick={resetFilter}
                className="text-sm bg-black text-white px-3 py-1 rounded"
              >
                Show All
              </button>
            )}
          </div>

          {/* NO RESULT MESSAGE */}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-20">
              No properties found for selected filters
            </p>
          )}

          {/*  GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={p.image}
                  className="h-40 w-full object-cover"
                  alt=""
                />

                <div className="p-5">
                  <h3 className="font-semibold text-lg">
                    {p.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {p.location}, Gujarat
                  </p>

                  <p className="mt-2 font-bold text-xl text-gray-900">
                    ₹ {p.pricePerUnit} / {p.unit}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Total:
                    <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      ₹ {p.totalPrice}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    Area: <b>{p.area}</b> · Type <b>{p.type}</b>
                  </p>

                  <button
                    onClick={() => navigate(`/property/${p.id}`)}
                    className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-emerald-600"
                  >
                    View Details
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
