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
    <section className="w-full mt-12 mb-12 px-6 md:px-10">
      <div className="w-full max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div>
            <h2 className="text-3xl text-center  font-bold text-gray-900">
              Popular Locations
            </h2>
            <p className="text-gray-500 mt-1">
              Explore land investments in Gujarat
            </p>
          </div>
        </div>

        {/* Scrollable Cards (NOW CENTERED) */}
        <div className="flex gap-6 justify-center items-center overflow-x-auto scrollbar-hide ">
          {locations.map((loc, index) => (
            <div
              key={index}
              onClick={() => handleLocationClick(loc.name)}
              className="min-w-50 cursor-pointer group"
            >
              <div className="rounded-3xl overflow-hidden shadow-md">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;
