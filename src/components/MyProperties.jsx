import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";

const formatPrice = (num) => {
  if (!num) return "0";
  const n = Number(num);
  if (n >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(2) + " Lakh";
  return n.toLocaleString("en-IN");
};

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // adjust key if needed
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE_URL}/api/submissions/my`;
        console.log("Fetching from:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error ${response.status}: ${errorText.substring(0, 100)}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error("Expected JSON, but received HTML. Check your API endpoint.");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [API_BASE_URL, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/property/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed: ${response.status} ${errorText.substring(0, 100)}`);
      }

      setProperties((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Could not delete property. Check console for details.");
    }
  };

  const handleEdit = (property) => {
    const propertyId = property._id || property.id;
    navigate(`/seller/edit-property/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-gray-600">Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-red-600 font-semibold">Error: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure your backend server is running and the API endpoint is correct.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Properties</h2>

      {properties.length === 0 && <p className="text-gray-500">No properties listed yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const propertyId = property._id || property.id;
          const totalPrice =
            property.totalPrice && property.totalPrice !== ""
              ? Number(property.totalPrice)
              : property.area && property.pricePerUnit
              ? Number(property.area) * Number(property.pricePerUnit)
              : 0;
          const pricePerUnit = property.pricePerUnit ? Number(property.pricePerUnit) : 0;
          const unit = property.unit || "Bigha";

          return (
            <div key={propertyId} className="bg-white rounded-2xl shadow-md overflow-hidden border">
              <div className="relative">
                <img
                  src={
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                  }
                  alt="property"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-white px-2 py-1 rounded text-blue-600 text-sm shadow hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(propertyId)}
                    className="bg-white px-2 py-1 rounded text-red-600 text-sm shadow hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
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
                  Area: <span className="font-semibold">{property.area} {unit.toUpperCase()}</span>
                  {" • "} Type <span className="font-semibold">{property.propertyType || "Land"}</span>
                </p>
                {property.landType && (
                  <p className="text-sm text-gray-600">
                    Land Type: <span className="font-medium">{property.landType}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {property.district || "Location"}, Gujarat
                </p>
                <button className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProperties;