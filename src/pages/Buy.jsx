import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

/* ===== EXISTING DEMO PROPERTIES ===== */
const demoProperties = [
  {
    id: "demo1",
    propertyType: "Agricultural Land",
    city: "Ahmedabad",
    district: "Ahmedabad",
    totalPrice: 10000000,
    area: "1",
    unit: "Bigha",
    coords: [23.0225, 72.5714],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: "demo2",
    propertyType: "Farm Land",
    city: "Rajkot",
    district: "Rajkot",
    totalPrice: 115200000,
    area: "12",
    unit: "Bigha",
    coords: [22.3039, 70.8022],
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
];

const Buy = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  /* ===== FETCH + MERGE DATA ===== */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("properties")) || [];

    const formattedStored = stored.map((p) => ({
      ...p,
      coords: [parseFloat(p.lat), parseFloat(p.lng)],
      totalPrice: Number(p.totalPrice),
      image: p.images?.[0] || "https://via.placeholder.com/400",
    }));

    // 🔥 MERGE DEMO + STORED
    const allProperties = [...demoProperties, ...formattedStored];

    setProperties(allProperties);
    setFiltered(allProperties);
  }, []);

  /* ========= FILTER ENGINE ========= */
  const handleFilterChange = (filters) => {
    let result = [...properties];

    if (filters.location) {
      result = result.filter((p) =>
        p.city
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      );
      setSelectedCity(filters.location);
    }

    if (filters.price) {
      result = result.filter(
        (p) =>
          p.totalPrice >= filters.price.min &&
          p.totalPrice <= filters.price.max
      );
    }

    if (filters.type) {
      result = result.filter(
        (p) => p.propertyType === filters.type
      );
    }

    setFiltered(result);
  };

  const handleMarkerClick = (city) => {
    const result = properties.filter(
      (p) => p.city === city
    );
    setFiltered(result);
    setSelectedCity(city);
  };

  const resetFilter = () => {
    setFiltered(properties);
    setSelectedCity("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">

      <BuyTopBar onFilterChange={handleFilterChange} />

      <div className="flex flex-1 overflow-hidden">

        {/* MAP */}
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

            {properties.map(
              (p) =>
                p.coords && (
                  <Marker
                    key={p.id}
                    position={p.coords}
                    eventHandlers={{
                      click: () =>
                        handleMarkerClick(p.city),
                    }}
                  >
                    <Popup>
                      <b>{p.propertyType}</b>
                      <br />
                      {p.city}, Gujarat
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </div>

        {/* LISTINGS */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCity
                ? `${selectedCity} Listings`
                : "Gujarat Listings"}
            </h2>

            {selectedCity && (
              <button
                onClick={resetFilter}
                className="text-sm bg-black text-white px-3 py-1 rounded cursor-pointer"
              >
                Show All
              </button>
            )}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-20">
              No properties found
            </p>
          )}

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
                    {p.propertyType}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {p.city}, {p.district}
                  </p>

                  <p className="mt-2 font-bold text-xl text-gray-900">
                    ₹ {p.totalPrice}
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    Area: <b>{p.area} {p.unit}</b>
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/property/${p.id}`)
                    }
                    className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-emerald-600 cursor-pointer"
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
