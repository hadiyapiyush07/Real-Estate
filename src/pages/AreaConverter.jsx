import { useState } from "react";

/*
  Gujarat standard:
  1 Bigha ≈ 0.625 Acre
*/
const UNITS = {
  bigha: 0.625,
  acre: 1,
  sqfeet: 43560,
  hectare: 2.47105,
  are: 100,
};

const AreaConverter = () => {
  const [fromUnit, setFromUnit] = useState("bigha");
  const [toUnit, setToUnit] = useState("acre");
  const [value, setValue] = useState("");

  const convertArea = () => {
    if (!value) return "0";
    const acreValue = Number(value) * UNITS[fromUnit];
    return (acreValue / UNITS[toUnit]).toFixed(4);
  };

  return (
    <div className="min-h-[80vh] bg-emerald-700 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex justify-center">
        <img
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc"
            className="max-h-[380px] rounded-xl shadow-xl"
            alt="Area Converter"
        />
        </div>

        {/* RIGHT CONVERTER CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">
            AREA CONVERTER
          </h2>

          {/* FROM */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">From</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="w-full border rounded-md p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full border rounded-md p-3 mt-1"
              >
                <option value="bigha">Bigha</option>
                <option value="acre">Acre</option>
                <option value="sqfeet">Sq Feet</option>
                <option value="hectare">Hectare</option>
                <option value="are">Are</option>
              </select>
            </div>
          </div>

          {/* TO */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">To</label>
              <input
                readOnly
                value={convertArea()}
                className="w-full border rounded-md p-3 mt-1 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Unit</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full border rounded-md p-3 mt-1"
              >
                <option value="bigha">Bigha</option>
                <option value="acre">Acre</option>
                <option value="sqfeet">Sq Feet</option>
                <option value="hectare">Hectare</option>
                <option value="are">Are</option>
              </select>
            </div>
          </div>

          {/* RESULT */}
          <div className="bg-gray-50 border rounded-md p-4 text-center">
            <p className="text-sm text-gray-500">Converted Result</p>
            <p className="text-xl font-bold text-emerald-700">
              {value || 0} {fromUnit} = {convertArea()} {toUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaConverter;
