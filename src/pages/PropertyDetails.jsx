import { useState } from "react";
import ImageGallery from "../components/ImageGallery";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PropertyDetails = () => {
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    totalPrice: "₹ 8.75 Crore",
    area: "70 Bigha",
    pricePerBigha: "₹ 12.50 Lakh",
    owner: "Ramesh Patel",
    address: "Sanand, Ahmedabad, Gujarat, India",
  });

  return (
    <>
      {/* ===== BACKGROUND BLUR ===== */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* ===== MODAL WRAPPER ===== */}
      <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto">
        <div className="relative mt-24 mb-24 w-[90%] max-w-7xl bg-white rounded-2xl shadow-2xl px-6 py-10">

          {/* ===== BACK BUTTON ===== */}
          <button
            onClick={() => navigate(-1)}
            className="absolute -left-14 top-6 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
          >
            <ArrowLeft />
          </button>

          {/* ===== CONTENT GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ===== LEFT SIDE ===== */}
            <div className="lg:col-span-2">
              <ImageGallery onChange={setDetails} />

              {/* ===== DETAILS BOX ===== */}
              <div className="mt-8 bg-white rounded-xl border p-6">
                <div className="flex flex-wrap justify-between gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {details.totalPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="font-semibold">{details.area}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Price / Bigha</p>
                    <p className="font-semibold">{details.pricePerBigha}</p>
                  </div>
                </div>

                <hr className="my-6" />

                <p className="text-sm text-gray-500">Land Address</p>
                <p className="font-medium">{details.address}</p>

                <hr className="my-6" />

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Property ID</p>
                    <p>#1916</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Land Owner</p>
                    <p>{details.owner}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Land Type</p>
                    <p>Agricultural Land</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT AGENT CARD ===== */}
            <div className="border rounded-xl p-6 h-fit">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
                className="w-24 h-24 rounded-full mx-auto object-cover"
                alt="Agent"
              />

              <h3 className="mt-4 text-center font-bold text-emerald-600">
                KRISHNA PROPERTY HUB
              </h3>

              <div className="text-center text-yellow-400 mt-2">
                ★★★★★
              </div>

              <p className="mt-3 text-center text-sm text-gray-600">
                Trusted local experts helping you buy and sell verified farmland
                across Gujarat.
              </p>

              <button className="mt-6 w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition">
                📞 Call Now
              </button>

              <button className="mt-3 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition">
                💬 WhatsApp
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
