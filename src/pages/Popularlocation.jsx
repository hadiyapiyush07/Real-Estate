import { useNavigate } from "react-router-dom";

import ahmedabad from "../assets/ahmedabad.jpg";
import surat from "../assets/surat.jpg";
import vadodara from "../assets/vadodara.jpg";
import rajkot from "../assets/rajkot.jpg";
import gandhinagar from "../assets/gandhinagar.jpg";

const locations = [
  { name: "Ahmedabad", image: ahmedabad },
  { name: "Surat", image: surat },
  { name: "Vadodara", image: vadodara },
  { name: "Rajkot", image: rajkot },
  { name: "Gandhinagar", image: gandhinagar },
];

const PopularLocations = () => {
  const navigate = useNavigate();

  const handleLocationClick = (city) => {
    // Redirect to buy page with city filter
    navigate(`/buy?location=${city}`);
  };

  return (
    <section className="w-full mt-12 mb-16 px-6 md:px-10">
      <div className="w-full max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Locations
            </h2>
            <p className="text-gray-500 mt-2">
              Explore land investments in Gujarat
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-7 justify-center items-center overflow-x-auto scrollbar-hide">
          {locations.map((loc, index) => (
            <div
              key={index}
              onClick={() => handleLocationClick(loc.name)}
              className="min-w-[260px] max-w-[260px] cursor-pointer group flex-shrink-0"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl transition duration-500">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-44 object-cover scale-100 group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold tracking-wide drop-shadow-lg">
                  {loc.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;