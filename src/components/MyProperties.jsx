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
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("properties")) || [];
    setProperties(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    localStorage.setItem("properties", JSON.stringify(updated));
  };

  const handleEdit = (property) => {
    localStorage.setItem("editProperty", JSON.stringify(property));
    navigate("/seller/add-property");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Properties</h2>

      {properties.length === 0 && <p>No properties listed yet.</p>}

      {/* GRID LIKE PROFESSIONAL LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          // Auto calculate total price if empty
          const totalPrice =
            property.totalPrice && property.totalPrice !== ""
              ? Number(property.totalPrice)
              : property.area && property.pricePerUnit
              ? Number(property.area) * Number(property.pricePerUnit)
              : 0;

          const pricePerUnit = property.pricePerUnit
            ? Number(property.pricePerUnit)
            : 0;

          const unit = property.unit || "Bigha";

          return (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border"
            >
              {/* IMAGE BANNER */}
              <div className="relative">
                <img
                  src={
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                  }
                  alt="property"
                  className="w-full h-52 object-cover"
                />

                {/* Edit/Delete */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-white px-2 py-1 rounded text-blue-600 text-sm shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-white px-2 py-1 rounded text-red-600 text-sm shadow"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                {/* PRICE PER UNIT (LIKE REFERENCE CARD) */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    ₹ {formatPrice(pricePerUnit)} / {unit}
                  </h2>
                </div>

                {/* TOTAL PRICE BADGE */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Total:</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ₹ {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* AREA + TYPE */}
                <p className="text-sm text-gray-700">
                  Area:{" "}
                  <span className="font-semibold">
                    {property.area} {unit.toUpperCase()}
                  </span>
                  {" • "}
                  Type{" "}
                  <span className="font-semibold">
                    {property.propertyType || "Land"}
                  </span>
                </p>

                {/* LAND TYPE */}
                {property.landType && (
                  <p className="text-sm text-gray-600">
                    Land Type:{" "}
                    <span className="font-medium">
                      {property.landType}
                    </span>
                  </p>
                )}

                {/* LOCATION */}
                <p className="text-sm text-gray-500">
                  {property.district || "Location"}, Gujarat
                </p>

                {/* VIEW DETAILS BUTTON */}
                <button className="w-full mt-3 bg-black text-white py-2 rounded-lg">
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
