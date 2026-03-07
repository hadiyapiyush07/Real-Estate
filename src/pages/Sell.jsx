import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flag, Lock, UserPlus } from "lucide-react";
import { useEffect } from "react";

const Sell = () => {
  const navigate = useNavigate();

  // Retrieve the full user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect only if the user is a seller
  useEffect(() => {
    if (user?.role === "seller") {
      navigate("/seller/add-property");
    }
  }, [user, navigate]);

  // If the user is a seller, we show nothing while redirecting
  if (user?.role === "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Redirecting...</h2>
          <p className="mt-4 text-gray-600">
            Taking you to the property listing form.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ================= HERO WITH BACKGROUND IMAGE ================= */}
      <section className="relative min-h-[75vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-8xl mx-auto px-6">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-white whitespace-nowrap drop-shadow-lg justify-center flex">
              SELL YOUR LAND WITH CONFIDENCE
            </h1>

            <p className="mt-5 text-gray-200 text-lg whitespace-nowrap text-center flex justify-center">
              Discover seamless solutions to maximize your agricultural land's value with{" "}
              <span className="font-semibold text-emerald-400 ml-1">
                ANAND CORPORATION limited
              </span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="py-24 bg-gradient-to-b from-gray-100 to-white flex justify-center">


          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center"
          >
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-emerald-100">
              <Lock className="text-emerald-600" size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Login Required as a Seller
            </h2>

            <p className="mt-3 text-gray-600 text-sm">
              Please login to list your land on{" "}
              <span className="font-semibold text-emerald-600">
                ANAND CORPORATION
              </span>
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-8 w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition cursor-pointer"
            >
              Login to Continue
            </button>
          </motion.div>

      </section>
    </div>
  );
};

export default Sell;