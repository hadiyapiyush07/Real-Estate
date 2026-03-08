import { useNavigate } from "react-router-dom"; // new import
import { Share2, Heart } from "lucide-react";

const formatPrice = (num) => {
  if (!num) return "0";
  const n = Number(num);

  if (n >= 10000000) return (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(2) + " Lakh";
  return n.toLocaleString("en-IN");
};

const PropertyCard = ({ property, onEdit, onDelete }) => {
  const navigate = useNavigate(); // new

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


  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1500382017468-9049fed747ef";

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;

    // Extract just the filename from the full path
    const filename = imagePath.split('\\').pop().split('/').pop();

    // Construct proper URL - note: /uploads/ matches the static serving in app.js
    return `http://localhost:5000/uploads/properties/${filename}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* IMAGE BANNER */}
      <div className="relative">
        <img
          src={getImageUrl(property.images?.[0])}
          alt="property"
          className="w-full h-52 object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* PRICE PER UNIT */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            ₹ {formatPrice(pricePerUnit)} / {unit}
          </h2>
        </div>

        {/* TOTAL BADGE */}
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

        {/* LOCATION */}
        <p className="text-sm text-gray-500">
          {property.district || "Location"} Gujarat
        </p>

        {/* VIEW DETAILS – now navigates */}
        <button
          onClick={() => navigate(`/property/${property.id}`)} // new
          className="w-full mt-3 bg-black text-white py-2 rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;