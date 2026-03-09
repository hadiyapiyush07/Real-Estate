import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../config/axios.jsx";
import BuyTopBar from "../components/BuyTopBar";
import PropertyCard from "../components/PropertyCard";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===== FETCH PROPERTIES FROM BACKEND USING CUSTOM AXIOS ===== */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Use api instance – baseURL is already set
        const response = await api.get("/buyerProperty?limit=100");
        const fetched = response.data.properties.map((p) => ({
          ...p,
          id: p._id,
          coords: [parseFloat(p.lat), parseFloat(p.lng)],
          totalPrice: Number(p.totalPrice),
          // Build full image URL – adjust base if needed
          image: p.images?.[0]
            ? `http://localhost:5000/${p.images[0]}`
            : "https://via.placeholder.com/400",
          city: p.district,
        }));
        setProperties(fetched);
        setFiltered(fetched);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
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
      navigate(`/buy?location=${encodeURIComponent(filters.location)}`, {
        replace: true,
      });
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
    navigate(`/buy?location=${encodeURIComponent(city)}`, { replace: true });
  };

  const resetFilter = () => {
    setFiltered(properties);
    setSelectedCity("");
    navigate("/buy", { replace: true });
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

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
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;