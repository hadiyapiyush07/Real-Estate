import { useState } from "react";
import { useNavigate } from "react-router-dom";

const gujaratCities = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Anand",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Mehsana",
];

const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      location: "Ahmedabad, Gujarat",
      bigha: 25,
      pricePerBigha: 1800000,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      location: "Rajkot, Gujarat",
      bigha: 40,
      pricePerBigha: 1200000,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      location: "Surat, Gujarat",
      bigha: 18,
      pricePerBigha: 2500000,
    },
  ];

  /* ================= SEARCH ================= */

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = gujaratCities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSearch = () => {
    if (!query) return;
    navigate(`/buy?city=${query}`);
  };

  return (
    <div className="w-full">
      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] w-full">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          className="absolute inset-0 h-full w-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold max-w-3xl">
            Find & Invest in <br /> Land Across Gujarat
          </h1>

          <p className="mt-5 text-gray-200 max-w-2xl">
            Browse verified land listings posted directly by sellers.
          </p>

          {/* SEARCH BOX */}
          <div className="mt-10 relative bg-white rounded-xl shadow-lg p-4 max-w-2xl flex gap-3">
            <div className="flex-1 relative">
              <input
                value={query}
                onChange={handleChange}
                placeholder="City, District or Village in Gujarat"
                className="w-full px-4 py-3 outline-none"
              />

              {suggestions.length > 0 && (
                <div className="absolute top-14 left-0 w-full bg-white border rounded-md shadow z-20">
                  {suggestions.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setQuery(city);
                        setSuggestions([]);
                        navigate(`/buy?city=${city}`);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {city}, Gujarat
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            Featured Land Listings in Gujarat
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {properties.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={item.image}
                  className="h-52 w-full object-cover"
                  alt=""
                />

                <div className="p-6">
                  <span className="inline-block mb-2 text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                    Verified Seller
                  </span>

                  <h3 className="text-lg font-semibold">
                    Agricultural Land
                  </h3>

                  <p className="text-sm text-gray-600">{item.location}</p>

                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-600">
                      {item.bigha} Bigha · ₹{" "}
                      {item.pricePerBigha.toLocaleString()} / Bigha
                    </p>

                    <p className="text-lg font-bold text-emerald-600">
                      ₹{" "}
                      {(item.bigha * item.pricePerBigha).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => navigate(`/property/${item.id}`)}
                      className="flex-1 py-2 bg-black text-white rounded-md hover:bg-emerald-600"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => navigate("/meeting")}
                      className="flex-1 py-2 border rounded-md hover:bg-gray-100"
                    >
                      Meet Broker
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl font-bold">
          Ready to Buy or Sell Land in Gujarat?
        </h2>
        <p className="mt-4 text-gray-300">
          Start your journey with ANAND CORPORATION today.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-8 px-10 py-3 bg-emerald-500 rounded-md hover:bg-emerald-600"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;
