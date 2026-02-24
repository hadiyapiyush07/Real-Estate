import { useNavigate } from "react-router-dom";
import heroImage from "../assets/phone.jpg";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full mt-6 px-6 md:px-10">
      <div className="w-full max-w-[1500px] mx-auto bg-gradient-to-b from-gray-50 to-gray-50 rounded-3xl py-16 md:py-20 flex items-center justify-between gap-10">
        
        {/* LEFT CONTENT */}
        <div className="max-w-2xl pl-8 md:pl-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Search lands anywhere
          </h1>

          <p className="text-lg text-gray-600 mt-4">
            Discover current land prices, lucrative investment opportunities,
            detailed land ownership records, and essential property insights to
            make informed real estate decisions.
          </p>

          <button
            onClick={() => navigate("/buy")}
            className="mt-6 px-7 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition cursor-pointer"
          >
            Explore Map
          </button>
        </div>

        {/* RIGHT IMAGE - SMALLER */}
        <div className="pr-8 md:pr-14">
          <img
            src={heroImage}
            alt="Map Preview"
            className="w-[160px] md:w-[220px] lg:w-[260px] rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;