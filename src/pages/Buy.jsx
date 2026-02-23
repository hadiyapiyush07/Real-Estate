import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
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
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
  {
    id: "demo3",
    propertyType: "Residential Plot",
    city: "Surat",
    district: "Surat",
    totalPrice: 8500000,
    area: "2",
    unit: "Bigha",
    coords: [21.1702, 72.8311],
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
  },
  {
    id: "demo4",
    propertyType: "Agricultural Land",
    city: "Vadodara",
    district: "Vadodara",
    totalPrice: 7200000,
    area: "3",
    unit: "Bigha",
    coords: [22.3072, 73.1812],
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5",
  },
  {
    id: "demo5",
    propertyType: "Farm Land",
    city: "Gandhinagar",
    district: "Gandhinagar",
    totalPrice: 9300000,
    area: "2",
    unit: "Bigha",
    coords: [23.2156, 72.6369],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    id: "demo6",
    propertyType: "Agricultural Land",
    city: "Bhavnagar",
    district: "Bhavnagar",
    totalPrice: 5400000,
    area: "4",
    unit: "Bigha",
    coords: [21.7645, 72.1519],
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  },
  {
    id: "demo7",
    propertyType: "Farm Land",
    city: "Jamnagar",
    district: "Jamnagar",
    totalPrice: 6100000,
    area: "3",
    unit: "Bigha",
    coords: [22.4707, 70.0577],
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  },
  {
    id: "demo8",
    propertyType: "Residential Plot",
    city: "Junagadh",
    district: "Junagadh",
    totalPrice: 4800000,
    area: "2",
    unit: "Bigha",
    coords: [21.5222, 70.4579],
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
  },
  {
    id: "demo9",
    propertyType: "Agricultural Land",
    city: "Anand",
    district: "Anand",
    totalPrice: 6900000,
    area: "3",
    unit: "Bigha",
    coords: [22.5645, 72.9289],
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  {
    id: "demo10",
    propertyType: "Farm Land",
    city: "Mehsana",
    district: "Mehsana",
    totalPrice: 5600000,
    area: "2",
    unit: "Bigha",
    coords: [23.5880, 72.3693],
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  },
];

/* ===== Map Zoom Handler ===== */
const MapZoomHandler = ({ city, properties }) => {
  const map = useMap();

  useEffect(() => {
    if (!city) return;

    const target = properties.find(
      (p) => p.city?.toLowerCase() === city.toLowerCase()
    );

    if (target?.coords) {
      map.setView(target.coords, 11, { animate: true });
    }
  }, [city, properties, map]);

  return null;
};

const Buy = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  /* ===== FETCH + MERGE DATA ===== */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("properties")) || [];

    const formattedStored = stored.map((p) => ({
      ...p,
      coords: [parseFloat(p.lat), parseFloat(p.lng)],
      totalPrice: Number(p.totalPrice),
      image: p.images?.[0] || "https://via.placeholder.com/400",
    }));

    const allProperties = [...demoProperties, ...formattedStored];
    setProperties(allProperties);
    setFiltered(allProperties);
  }, []);

  /* ===== Handle initial URL param ===== */
  useEffect(() => {
    if (properties.length === 0) return;

    const cityParam = searchParams.get("location");
    if (cityParam) {
      const matched = properties.filter(
        (p) => p.city?.toLowerCase() === cityParam.toLowerCase()
      );
      if (matched.length > 0) {
        setFiltered(matched);
        setSelectedCity(cityParam);
      } else {
        // If city not found, reset param
        navigate("/buy", { replace: true });
      }
    } else {
      // No param: reset to all properties
      setFiltered(properties);
      setSelectedCity("");
    }
  }, [searchParams, properties, navigate]);

  /* ===== Filter Engine ===== */
  const handleFilterChange = (filters) => {
    let result = [...properties];

    if (filters.location) {
      result = result.filter((p) =>
        p.city?.toLowerCase().includes(filters.location.toLowerCase())
      );
      setSelectedCity(filters.location);
      // Update URL with new city
      navigate(`/buy?location=${encodeURIComponent(filters.location)}`, { replace: true });
    }

    if (filters.price) {
      result = result.filter(
        (p) =>
          p.totalPrice >= filters.price.min &&
          p.totalPrice <= filters.price.max
      );
    }

    if (filters.type) {
      result = result.filter((p) => p.propertyType === filters.type);
    }

    setFiltered(result);
  };

  const handleMarkerClick = (city) => {
    const matched = properties.filter((p) => p.city === city);
    setFiltered(matched);
    setSelectedCity(city);
    // Update URL
    navigate(`/buy?location=${encodeURIComponent(city)}`, { replace: true });
  };

  const resetFilter = () => {
    setFiltered(properties);
    setSelectedCity("");
    navigate("/buy", { replace: true });
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
                      click: () => handleMarkerClick(p.city),
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

            {/* Zoom handler that reacts to selectedCity */}
            <MapZoomHandler city={selectedCity} properties={properties} />
          </MapContainer>
        </div>

        {/* LISTINGS */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCity ? `${selectedCity} Listings` : "Gujarat Listings"}
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
            {filtered.map((p) => {
              const pricePerUnit =
                p.pricePerUnit && p.area
                  ? Number(p.pricePerUnit)
                  : p.totalPrice && p.area
                  ? Math.round(Number(p.totalPrice) / Number(p.area))
                  : 0;

              const totalPrice = Number(p.totalPrice) || 0;
              const unit = p.unit || "Bigha";

              const formatPrice = (num) => {
                if (!num) return "0";
                if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
                if (num >= 100000) return (num / 100000).toFixed(2) + " Lakh";
                return num.toLocaleString("en-IN");
              };

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      className="h-48 w-full object-cover"
                      alt="property"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">
                        ₹ {formatPrice(pricePerUnit)} / {unit}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm">Total:</span>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                        ₹ {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Area:{" "}
                      <span className="font-semibold">
                        {p.area} {unit.toUpperCase()}
                      </span>
                      {" • "}
                      Type{" "}
                      <span className="font-semibold">
                        {p.propertyType}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.district}, Gujarat
                    </p>
                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-emerald-600 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;