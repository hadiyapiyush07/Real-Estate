import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { ArrowLeft } from "lucide-react";
import api from "../config/axios";

const formatPrice = (num) => {
  if (!num) return "0";
  const n = Number(num);

  if (n >= 10000000) return "₹ " + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹ " + (n / 100000).toFixed(2) + " Lakh";
  return "₹ " + n.toLocaleString("en-IN");
};

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get property ID from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/buyerProperty/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Format the price per unit and total price
  const formatPricePerUnit = () => {
    if (!property) return "N/A";
    const unit = property.unit || "Bigha";
    const price = property.pricePerUnit || 0;
    return `${formatPrice(price)} / ${unit}`;
  };

  const formatTotalPrice = () => {
    if (!property) return "N/A";
    return formatPrice(property.totalPrice || 0);
  };

  const formatArea = () => {
    if (!property) return "N/A";
    const unit = property.unit || "Bigha";
    return `${property.area || 0} ${unit}`;
  };

  // Get the full image URLs
  const getImageUrls = () => {
    if (!property?.images || property.images.length === 0) {
      return ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"];
    }
    return property.images.map(img =>
      img.startsWith("http") ? img : `http://localhost:5000/${img}`
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="text-xl">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Property not found"}</p>
          <button
            onClick={() => navigate("/buy")}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== BACKGROUND BLUR ===== */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* ===== MODAL WRAPPER ===== */}
      <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto">
        <div className="relative mt-24 mb-24 w-[90%] max-w-7xl bg-white rounded-2xl shadow-2xl px-6 py-10">

          {/* ===== BACK BUTTON ===== */}
          <button
            onClick={() => navigate(-1)}
            className="absolute -left-14 top-6 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft />
          </button>

          {/* ===== CONTENT GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ===== LEFT SIDE ===== */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={getImageUrls()[currentImageIndex]}
                  alt="Property"
                  className="w-full h-96 object-cover"
                />
                {getImageUrls().length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {getImageUrls().map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${currentImageIndex === index
                          ? "border-emerald-600 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ===== DETAILS BOX ===== */}
              <div className="mt-8 bg-white rounded-xl border p-6">
                <div className="flex flex-wrap justify-between gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {formatTotalPrice()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="font-semibold">{formatArea()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Price / Unit</p>
                    <p className="font-semibold">{formatPricePerUnit()}</p>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Land Address */}
                <p className="text-sm text-gray-500">Land Address</p>
                <p className="font-medium">
                  {property.district || "Location"}, Gujarat
                  {property.lat && property.lng && (
                    <span className="text-gray-400 text-sm ml-2">
                      (Lat: {property.lat.toFixed(4)}, Lng: {property.lng.toFixed(4)})
                    </span>
                  )}
                </p>

                {/* Description if available */}
                {property.description && (
                  <>
                    <hr className="my-6" />
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{property.description}</p>
                  </>
                )}

                <hr className="my-6" />

                {/* Property Details Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Property ID</p>
                    <p className="font-mono text-sm">#{property._id.slice(-6)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p>{property.propertyType || "Agricultural"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Land Type</p>
                    <p>{property.landType || "Not specified"}</p>
                  </div>

                  {property.soilType && (
                    <div>
                      <p className="text-sm text-gray-500">Soil Type</p>
                      <p>{property.soilType}</p>
                    </div>
                  )}

                  {property.waterLevel && (
                    <div>
                      <p className="text-sm text-gray-500">Water Level</p>
                      <p>{property.waterLevel} ft</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Road Access</p>
                    <p>{property.roadAccess ? "✅ Yes" : "❌ No"}</p>
                  </div>

                  {property.highway !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Highway</p>
                      <p>{property.highway ? "✅ Yes" : "❌ No"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== RIGHT AGENT CARD ===== */}
            <div className="border rounded-xl p-6 h-fit sticky top-24">
              <img
                src=""
                className="w-24 h-24 rounded-full mx-auto object-cover"
                alt="Agent"
              />

              <h3 className="mt-4 text-center font-bold text-emerald-600">
                AANAD COOPORATION
              </h3>

              <div className="text-center text-yellow-400 mt-2">
                {"★".repeat(5)}
              </div>

              <p className="mt-3 text-center text-sm text-gray-600">
                Trusted local experts helping you buy and sell verified farmland
                across Gujarat.
              </p>

              <button className="mt-6 w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition">
                📞 Call Now
              </button>

              <button className="mt-3 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition">
                💬 WhatsApp
              </button>

              {/* Property listed date */}
              <p className="mt-4 text-xs text-center text-gray-400">
                Listed: {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;