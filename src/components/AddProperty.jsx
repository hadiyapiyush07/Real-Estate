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
  const map = useMapEvents({
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

  const [form, setForm] = useState(
    editProperty || {
      id: Date.now(),
      propertyType: "",
      district: "",
      taluka: "",
      area: "",
      unit: "",
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) =>
      URL.createObjectURL(file)
    );
    setForm({ ...form, images: imageUrls });
  };

  const pricePerUnit =
    form.area && form.totalPrice
      ? (Number(form.totalPrice) / Number(form.area)).toFixed(2)
      : "";

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!form.propertyType) newErrors.propertyType = "Required";
      if (!form.district) newErrors.district = "Required";
      if (!form.area) newErrors.area = "Required";
      if (!form.unit) newErrors.unit = "Required";
      if (!form.totalPrice) newErrors.totalPrice = "Required";
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
    <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl mx-auto">

      {/* ===== PROFESSIONAL PROGRESS BAR ===== */}
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

            <span className={`mt-2 text-sm 
              ${step === s ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
              {["Land Details","Upload Images","Site Details","Review"][index]}
            </span>
          </div>
        ))}
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-6">

          <select name="propertyType" onChange={handleChange} className="input">
            <option value="">Select Property Type</option>
            <option>Agricultural</option>
            <option>Farm</option>
            <option>Plot</option>
          </select>

          <select name="district" onChange={handleChange} className="input">
            <option value="">Select District (Gujarat)</option>
            {gujaratDistricts.map((d,i)=>(
              <option key={i}>{d}</option>
            ))}
          </select>

          <input name="taluka" placeholder="Taluka" onChange={handleChange} className="input"/>

          <div className="flex gap-2">
            <input name="area" placeholder="Area" onChange={handleChange} className="input"/>
            <select name="unit" onChange={handleChange} className="input w-40">
              <option value="">Unit</option>
              <option>Acre</option>
              <option>Bigha</option>
              <option>Sq.ft</option>
            </select>
          </div>

          <input name="totalPrice" placeholder="Total Price (₹)" onChange={handleChange} className="input"/>

          <input
            value={pricePerUnit}
            placeholder="Price Per Unit (Auto)"
            disabled
            className="input bg-gray-100"
          />

          <textarea
            name="description"
            placeholder="Property Description"
            onChange={handleChange}
            className="input col-span-2"
          />

          
        </div>

      )}

      <div className="space-y-8">

    {/* ================= ROAD ACCESS ================= */}
    <br></br>
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Road Access</h3>
        <p className="text-sm text-gray-500">
          Enable if the property has road access
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          name="roadAccess"
          checked={form.roadAccess}
          onChange={handleChange}
          className="w-5 h-5 cursor-pointer"
        />

        {form.roadAccess && (
          <input
            name="roadWidth"
            placeholder="Enter in feet"
            value={form.roadWidth}
            onChange={handleChange}
            className="input w-40"
          />
        )}
      </div>
    </div>

    {/* ================= HIGHWAY ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">
          Highway/Expressway Connectivity
        </h3>
        <p className="text-sm text-gray-500">
          Near highway or expressway
        </p>
      </div>

      <input
        type="checkbox"
        name="highway"
        checked={form.highway}
        onChange={handleChange}
        className="w-5 h-5 cursor-pointer"
      />
    </div>

    {/* ================= WATER LEVEL ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Water Level</h3>
        <p className="text-sm text-gray-500">
          Ground water level in feet
        </p>
      </div>

      <input
        name="waterLevel"
        value={form.waterLevel}
        onChange={handleChange}
        placeholder="In Feet"
        className="input w-40"
      />
    </div>

    {/* ================= LAND TYPE ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Land Type</h3>
        <p className="text-sm text-gray-500">
          Select the type of land
        </p>
      </div>

      <select
        name="landType"
        value={form.landType}
        onChange={handleChange}
        className="input w-60"
      >
        <option value="">Select Land Type</option>
        <option>Irrigated</option>
        <option>Non-Irrigated</option>
        <option>Commercial</option>
        <option>Residential</option>
      </select>
    </div>

    {/* ================= SOIL TYPE ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Soil Type</h3>
        <p className="text-sm text-gray-500">
          Type of soil on the land
        </p>
      </div>

      <select
        name="soilType"
        value={form.soilType}
        onChange={handleChange}
        className="input w-60"
      >
        <option value="">Select Soil Type</option>
        <option>Black Soil</option>
        <option>Red Soil</option>
        <option>Clay</option>
        <option>Sandy</option>
      </select>
    </div>

    {/* ================= OWNERSHIP ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Ownership</h3>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          name="ownership"
          checked={form.ownership}
          onChange={handleChange}
          className="w-5 h-5 cursor-pointer"
        />

        {form.ownership && (
          <input
            name="ownerCount"
            placeholder="No. of owner"
            value={form.ownerCount}
            onChange={handleChange}
            className="input w-40"
          />
        )}
      </div>
    </div>

    {/* ================= CATEGORY ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Category</h3>
        <p className="text-sm text-gray-500">
          Ownership category
        </p>
      </div>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="input w-60"
      >
        <option value="">None</option>
        <option>Freehold</option>
        <option>Leasehold</option>
        <option>Joint</option>
      </select>
    </div>

    {/* ================= LAND ZONING ================= */}
    <div className="border rounded-xl p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">Land Zoning</h3>
        <p className="text-sm text-gray-500">
          Zoning applicability
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setForm({ ...form, zoning: "Applicable" })}
          className={`px-4 py-1 rounded-full cursor-pointer ${
            form.zoning === "Applicable"
              ? "bg-emerald-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Applicable
        </button>

        <button
          type="button"
          onClick={() => setForm({ ...form, zoning: "Not Applicable" })}
          className={`px-4 py-1 rounded-full cursor-pointer ${
            form.zoning === "Not Applicable"
              ? "bg-emerald-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Not Applicable
        </button>
      </div>
    </div>

  </div>


      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div>
          <input type="file" multiple onChange={handleImageUpload} />
          <p className="text-red-500 text-sm">{errors.images}</p>
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      
      {step === 3 && (
  <div className="space-y-6">

    <h2 className="text-xl font-semibold">
      Pin Property Location (Gujarat Only)
    </h2>

    <MapContainer
      center={[22.7, 71.5]}
      zoom={7}
      minZoom={6}
      maxBounds={gujaratBounds}
      maxBoundsViscosity={1}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationPicker form={form} setForm={setForm} />
    </MapContainer>

    <div className="grid grid-cols-2 gap-4">
      <input
        value={form.lat}
        readOnly
        placeholder="Latitude"
        className="input"
      />
      <input
        value={form.lng}
        readOnly
        placeholder="Longitude"
        className="input"
      />
    </div>

  </div>
)}


  


      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Review Details</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(form,null,2)}
          </pre>
        </div>
      )}

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}
            className="bg-gray-200 px-6 py-2 rounded">
            Back
          </button>
        )}

        {step < 4 ? (
          <button onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-2 rounded">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}
            className="bg-emerald-600 text-white px-6 py-2 rounded">
            Submit Property
          </button>
        )}
      </div>

    </div>
  );
};

export default AddProperty;
