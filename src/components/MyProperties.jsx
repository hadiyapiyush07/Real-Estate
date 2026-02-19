import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

      <div className="grid gap-6">
        {properties.map((property) => (
          <div key={property.id} className="border p-5 rounded-lg">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">
                  {property.city}, {property.state}
                </h3>
                <p>{property.area} {property.unit}</p>
                <p>₹{property.totalPrice}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(property)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {property.images.map((img, index) => (
                <img key={index} src={img} className="w-20 h-20 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;
