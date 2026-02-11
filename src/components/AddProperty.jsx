import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();
  const editProperty = JSON.parse(localStorage.getItem("editProperty"));

  const [step, setStep] = useState(1);

  const [form, setForm] = useState(
    editProperty || {
      id: Date.now(),
      state: "",
      district: "",
      city: "",
      area: "",
      unit: "",
      totalPrice: "",
      description: "",
      images: [],
      lat: "",
      lng: "",
    }
  );

  useEffect(() => {
    if (editProperty) {
      localStorage.removeItem("editProperty");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setForm({ ...form, images: imageUrls });
  };

  const handleSubmit = () => {
    let properties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const existingIndex = properties.findIndex(
      (p) => p.id === form.id
    );

    if (existingIndex !== -1) {
      properties[existingIndex] = form;
    } else {
      properties.push(form);
    }

    localStorage.setItem("properties", JSON.stringify(properties));
    navigate("/seller/my-properties");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">

      {/* STEP BAR */}
      <div className="flex justify-between mb-10">
        {["Land Details", "Upload Images", "Map Location", "Review"].map(
          (item, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                step === index + 1
                  ? "text-emerald-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {item}
            </div>
          )
        )}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-6">
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input" />
          <input name="district" value={form.district} onChange={handleChange} placeholder="District" className="input" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City/Village" className="input" />
          <input name="area" value={form.area} onChange={handleChange} placeholder="Area" className="input" />
          <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit (Acre/Bigha)" className="input" />
          <input name="totalPrice" value={form.totalPrice} onChange={handleChange} placeholder="Total Price" className="input" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input col-span-2" />
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
          <div className="flex gap-4 mt-4">
            {form.images.map((img, index) => (
              <img key={index} src={img} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="grid grid-cols-2 gap-6">
          <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude" className="input" />
          <input name="lng" value={form.lng} onChange={handleChange} placeholder="Longitude" className="input" />
          <p className="col-span-2 text-sm text-gray-500">
            (Later you can integrate Google Map picker)
          </p>
        </div>
      )}

      {/* STEP 4 REVIEW */}
      {step === 4 && (
        <div className="space-y-3">
          <p><strong>Location:</strong> {form.city}, {form.district}, {form.state}</p>
          <p><strong>Area:</strong> {form.area} {form.unit}</p>
          <p><strong>Total Price:</strong> ₹{form.totalPrice}</p>
          <p><strong>Description:</strong> {form.description}</p>
          <div className="flex gap-3">
            {form.images.map((img, index) => (
              <img key={index} src={img} className="w-20 h-20 rounded" />
            ))}
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="bg-gray-200 px-6 py-2 rounded">
            Back
          </button>
        )}

        {step < 4 ? (
          <button onClick={() => setStep(step + 1)} className="bg-emerald-600 text-white px-6 py-2 rounded">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="bg-emerald-600 text-white px-6 py-2 rounded">
            Submit Property
          </button>
        )}
      </div>
    </div>
  );
};

export default AddProperty;
