import { useState, useEffect } from "react";
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
  "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch",
  "Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang",
  "Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar",
  "Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi",
  "Narmada","Navsari","Panchmahal","Patan","Porbandar",
  "Rajkot","Sabarkantha","Surat","Surendranagar",
  "Tapi","Vadodara","Valsad"
];

const AddProperty = () => {
  const navigate = useNavigate();
  const editProperty = JSON.parse(localStorage.getItem("editProperty"));

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState("");

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
      roadWidth: "",
      highway: false,
      waterLevel: "",
      landType: "",
      soilType: "",
      ownership: false,
      ownerCount: "",
      category: "",
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
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ===== IMAGE UPLOAD =====
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE = 3 * 1024 * 1024; // 3MB
    const MAX_IMAGES = 6;

    if (form.images.length + files.length > MAX_IMAGES) {
      setUploadError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    for (let file of files) {
      if (file.size > MAX_SIZE) {
        setUploadError(`File "${file.name}" exceeds 3MB limit.`);
        return;
      }
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setForm({
      ...form,
      images: [...form.images, ...newImageUrls],
    });
    setUploadError("");
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(form.images[indexToRemove]);
    const updatedImages = form.images.filter((_, idx) => idx !== indexToRemove);
    setForm({ ...form, images: updatedImages });
  };

  // Auto Total Price
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
      if (!Totalprice) newErrors.totalPrice = "Required";
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

  const handleSubmit = () => {
    const calculatedTotalPrice =
      form.area && form.pricePerUnit
        ? (Number(form.pricePerUnit) * Number(form.area)).toString()
        : "";

    const finalForm = {
      ...form,
      totalPrice: calculatedTotalPrice,
    };

    const properties =
      JSON.parse(localStorage.getItem("properties") || "[]");

    const existingIndex = properties.findIndex(
      (p) => p.id === finalForm.id
    );

    if (existingIndex !== -1) {
      properties[existingIndex] = finalForm;
    } else {
      properties.push(finalForm);
    }

    localStorage.setItem("properties", JSON.stringify(properties));
    navigate("/seller/my-properties");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl mx-auto">

      {/* ===== PROGRESS BAR ===== */}
      <div className="flex items-center justify-between mb-12 relative">
        {[1,2,3,4].map((s,index)=>(
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
              {["Land Details","Upload Images","Map Location","Review"][index]}
            </span>
          </div>
        ))}
      </div>

      {/* ================= STEP 1 (WITH ERROR MESSAGES) ================= */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">

            <div>
              <select name="propertyType" onChange={handleChange} className="input">
                <option value="">Select Property Type</option>
                <option>Agricultural</option>
                <option>Farm</option>
                <option>Plot</option>
              </select>
              {errors.propertyType && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
              )}
            </div>

            <div>
              <select name="district" onChange={handleChange} className="input">
                <option value="">Select District (Gujarat)</option>
                {gujaratDistricts.map((d,i)=>(
                  <option key={i}>{d}</option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  name="area"
                  placeholder="Area"
                  type="number"
                  step="any"  // allows decimals
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow decimals (including empty)
                    if (/^\d*\.?\d*$/.test(value) || value === "") {
                      handleChange(e);
                    }
                  }}
                  className="input"
                />
                {errors.area && (
                  <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                )}
              </div>

              <div>
                <select name="unit" onChange={handleChange} className="input w-40">
                  <option value="">Unit</option>
                  <option>Acre</option>
                  <option>Bigha</option>
                  <option>Sq.ft</option>
                </select>
                {errors.unit && (
                  <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                )}
              </div>
            </div>

            <div>
              <input
                name="pricePerUnit"
                placeholder="Price per Unit (₹)"
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <input
                value={Totalprice}
                placeholder="Total Price (Auto)"
                disabled
                className="input bg-gray-100"
              />
              {errors.totalPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.totalPrice}</p>
              )}
            </div>

            <textarea
              name="description"
              placeholder="Property Description"
              onChange={handleChange}
              className="input col-span-2"
            />

            {/* ===== SITE DETAILS ===== */}
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

      {/* ================= STEP 2 (REDESIGNED) ================= */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              id="imageUpload"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-600 font-medium">
                Click to upload images
              </span>
              <span className="text-sm text-gray-500 mt-1">
                (Max 6 images, up to 3MB each)
              </span>
            </label>
          </div>

          {uploadError && (
            <div className="text-red-500 text-sm mt-2">{uploadError}</div>
          )}
          {errors.images && (
            <div className="text-red-500 text-sm">{errors.images}</div>
          )}

          {form.images.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Images ({form.images.length}/6)
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div className="space-y-6">
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

                    setForm((prev) => ({
                      ...prev,
                      lat: lat,
                      lng: lon,
                    }));

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

          <MapContainer
            center={[22.7, 71.5]}
            zoom={7}
            minZoom={6}
            maxZoom={18}
            maxBounds={gujaratBounds}
            maxBoundsViscosity={1}
            style={{ height: "500px", width: "100%", borderRadius: "12px" }}
            whenCreated={(map) => {
              window.mapRef = map;
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationPicker form={form} setForm={setForm} />
          </MapContainer>
        </div>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(form,null,2)}
        </pre>
      )}

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-gray-200 px-6 py-2 rounded"
          >
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-6 py-2 rounded"
          >
            Submit Property
          </button>
        )}
      </div>
    </div>
  );
};

export default AddProperty;