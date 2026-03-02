import { useState, useEffect } from "react";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationPicker({ form, setForm }) {
  useMapEvents({
    click(e) {
      setForm({
        ...form,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return form.lat ? (
    <Marker position={[form.lat, form.lng]} />
  ) : null;
}

const gujaratBounds = [
  [20.0, 68.0],
  [24.7, 74.5],
];

const gujaratDistricts = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
  "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang",
  "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar",
  "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi",
  "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar",
  "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
  "Tapi", "Vadodara", "Valsad"
];

const AddProperty = () => {
  const navigate = useNavigate();
  const editProperty = JSON.parse(localStorage.getItem("editProperty"));

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState(
    editProperty || {
      id: Date.now(),
      propertyType: "",
      district: "",
      area: "",
      unit: "",
      pricePerUnit: "",
      totalPrice: "",
      description: "",
      roadAccess: false,
      highway: false,
      waterLevel: "",
      landType: "",
      soilType: "",
      images: [], // This will now store { file: File, preview: "blob:http..." } objects
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
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Store both the File object (for backend upload) and preview URL (for UI)
    const newImages = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));

    // You can choose to append or replace images here. Assuming append:
    setForm({ ...form, images: [...form.images, ...newImages] });
  };

  // Auto Total Price (LIVE)
  const Totalprice =
    form.area && form.pricePerUnit
      ? (Number(form.pricePerUnit) * Number(form.area)).toFixed(2)
      : "";

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!form.propertyType) newErrors.propertyType = "Required";
      if (!form.district) newErrors.district = "Required";
      if (!form.area) newErrors.area = "Required";
      if (!form.unit) newErrors.unit = "Required";
      if (!Totalprice) newErrors.totalPrice = "Required"; // fixed
    }

    if (step === 2 && form.images.length === 0)
      newErrors.images = "Upload at least 1 image";

    if (step === 3) {
      if (!form.lat) newErrors.lat = "Required";
      if (!form.lng) newErrors.lng = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  // ✅ FIXED SUBMIT (PREPARED FOR BACKEND)
  const handleSubmit = async () => {
    // calculate total price before saving
    const calculatedTotalPrice =
      form.area && form.pricePerUnit
        ? (Number(form.pricePerUnit) * Number(form.area)).toString()
        : "";

    const formData = new FormData();

    // 1. Append all text fields (convert booleans to strings for FormData)
    formData.append("propertyType", form.propertyType);
    formData.append("district", form.district);
    formData.append("area", form.area);
    formData.append("unit", form.unit);
    formData.append("pricePerUnit", form.pricePerUnit);
    formData.append("totalPrice", calculatedTotalPrice);
    formData.append("description", form.description || '');
    formData.append("roadAccess", form.roadAccess.toString());
    formData.append("highway", form.highway.toString());
    formData.append("waterLevel", form.waterLevel || '');
    formData.append("landType", form.landType || '');
    formData.append("soilType", form.soilType || '');
    formData.append("lat", form.lat);
    formData.append("lng", form.lng);

    // 2. Append all image files
    if (form.images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    form.images.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    try {
      const response = await api.post("/submissions", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Success:", response.data);
      alert("Property submitted successfully!");
      navigate("/seller/my-properties");

    } catch (error) {
      console.error("Error submitting property:", error);

      // Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        // Show user-friendly error message
        const errorMessage = error.response.data.message ||
          error.response.data.error ||
          "Failed to upload property.";
        alert(`Error: ${errorMessage}`);

      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl mx-auto">

      {/* ===== PROGRESS BAR ===== */}
      <div className="flex items-center justify-between mb-12 relative">
        {[1, 2, 3, 4].map((s, index) => (
          <div key={s} className="flex-1 flex flex-col items-center relative">
            {index !== 3 && (
              <div className={`absolute top-4 left-1/2 w-full h-1 
                ${step > s ? "bg-emerald-600" : "bg-gray-300"}`} />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10
              ${step >= s ? "bg-emerald-600 text-white" : "bg-gray-300"}`}>
              {s}
            </div>
            <span className="mt-2 text-sm">
              {["Land Details", "Upload Images", "Map Location", "Review"][index]}
            </span>
          </div>
        ))}
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">

            <select name="propertyType" onChange={handleChange} className="input">
              <option value="">Select Property Type</option>
              <option>Agricultural</option>
              <option>Farm</option>
              <option>Plot</option>
            </select>

            <select name="district" onChange={handleChange} className="input">
              <option value="">Select District (Gujarat)</option>
              {gujaratDistricts.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                name="area"
                placeholder="Area"
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="input"
              />

              <select name="unit" onChange={handleChange} className="input w-40">
                <option value="">Unit</option>
                <option>Acre</option>
                <option>Bigha</option>
                <option>Sq.ft</option>
              </select>
            </div>

            <input
              name="pricePerUnit"
              placeholder="Price per Unit(₹)"
              onChange={handleChange}
              className="input"
            />

            <input
              value={Totalprice}
              placeholder="Total Price (Auto)"
              disabled
              className="input bg-gray-100"
            />

            <textarea
              name="description"
              placeholder="Property Description"
              onChange={handleChange}
              className="input col-span-2"
            />
            {/* ===== SITE DETAILS (OLD SECTION RESTORED — NO OTHER CHANGES) ===== */}
            <div className="space-y-6 col-span-2 mt-4">

              <div className="border rounded-xl p-6 flex justify-between items-center">
                <span>Road Access</span>
                <input
                  type="checkbox"
                  name="roadAccess"
                  checked={form.roadAccess}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
              </div>

              <div className="border rounded-xl p-6 flex justify-between items-center">
                <span>Highway Connectivity</span>
                <input
                  type="checkbox"
                  name="highway"
                  checked={form.highway}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
              </div>

              <div className="border rounded-xl p-6 flex justify-between items-center">
                <span>Water Level</span>
                <input
                  name="waterLevel"
                  value={form.waterLevel}
                  onChange={handleChange}
                  placeholder="In Feet"
                  className="input w-40"
                />
              </div>

              <div className="border rounded-xl p-6 flex justify-between items-center">
                <span>Land Type</span>
                <select
                  name="landType"
                  value={form.landType}
                  onChange={handleChange}
                  className="input w-60"
                >
                  <option value="">Select</option>
                  <option>Irrigated</option>
                  <option>Non-Irrigated</option>
                  <option>Commercial</option>
                  <option>Residential</option>
                </select>
              </div>

              <div className="border rounded-xl p-6 flex justify-between items-center">
                <span>Soil Type</span>
                <select
                  name="soilType"
                  value={form.soilType}
                  onChange={handleChange}
                  className="input w-60"
                >
                  <option value="">Select</option>
                  <option>Black Soil</option>
                  <option>Red Soil</option>
                  <option>Clay</option>
                  <option>Sandy</option>
                </select>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>
      )}


      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div className="space-y-6">

          {/* SEARCH BAR WITH AUTO MARK + ZOOM */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search District / Taluka (Ahmedabad, Surat, Rajkot...)"
              className="input w-full"
              list="gujarat-locations"
              onChange={async (e) => {
                const value = e.target.value;
                if (!value || value.length < 2) return;

                try {
                  const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${value}, Gujarat, India&limit=1`
                  );
                  const data = await res.json();

                  if (data && data.length > 0 && window.mapRef) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    // 1️⃣ SET FORM LOCATION (THIS WILL AUTO SHOW MARKER)
                    setForm((prev) => ({
                      ...prev,
                      lat: lat,
                      lng: lon,
                    }));

                    // 2️⃣ FORCE ZOOM TO THAT EXACT LOCATION
                    window.mapRef.flyTo([lat, lon], 14, {
                      animate: true,
                      duration: 1.5,
                    });
                  }
                } catch (err) {
                  console.log("Search failed", err);
                }
              }}
            />

            {/* DISTRICT + TALUKA SUGGESTIONS */}
            <datalist id="gujarat-locations">
              <option value="Ahmedabad" />
              <option value="Surat" />
              <option value="Rajkot" />
              <option value="Vadodara" />
              <option value="Gandhinagar" />
              <option value="Bhavnagar" />
              <option value="Jamnagar" />
              <option value="Junagadh" />
              <option value="Kutch" />
              <option value="Mehsana" />
              <option value="Anand" />
              <option value="Navsari" />
              <option value="Valsad" />
              <option value="Morbi" />
              <option value="Porbandar" />
              <option value="Patan" />
              <option value="Bharuch" />
              <option value="Amreli" />
              <option value="Surendranagar" />
              {/* Talukas */}
              <option value="Sanand" />
              <option value="Dholka" />
              <option value="Kalol" />
              <option value="Bardoli" />
              <option value="Olpad" />
              <option value="Jetpur" />
              <option value="Gondal" />
              <option value="Anjar" />
              <option value="Mandvi Gujarat" />
            </datalist>
          </div>

          {/* SIMPLE MAP (GUJARAT ONLY) */}
          <MapContainer
            center={[22.7, 71.5]}
            zoom={7}
            minZoom={6}
            maxZoom={18}
            maxBounds={gujaratBounds}
            maxBoundsViscosity={1}
            style={{ height: "500px", width: "100%", borderRadius: "12px" }}
            whenCreated={(map) => {
              window.mapRef = map; // store map instance for zoom + marker sync
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* AUTO MARKER ON SEARCH + CLICK (UNCHANGED BEHAVIOUR) */}
            <LocationPicker form={form} setForm={setForm} />
          </MapContainer>
        </div>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(form, null, 2)}
        </pre>
      )}

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-gray-200 px-6 py-2 rounded">
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-2 rounded cursor-pointer">
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-6 py-2 rounded">
            Submit Property
          </button>
        )}
      </div>
    </div>
  );
};

export default AddProperty;


