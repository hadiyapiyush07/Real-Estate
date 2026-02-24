import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flag, Lock } from "lucide-react";

const Sell = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <div className="w-full">

      {/* ================= HERO WITH BACKGROUND IMAGE ================= */}
      <section className="relative min-h-[75vh] flex items-center">
        
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg')",
          }}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/55" />

        {/* CONTENT */}
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
            Discover seamless solutions to maximize your agricultural land’s value with{" "}
            <span className="font-semibold text-emerald-400 ml-1">
              ANAND CORPORATION limited
            </span>.
        </p>



          </motion.div>
        </div>
      </section>

      {/* ================= LOGIN / FORM SECTION ================= */}
      <section className="py-24 bg-gradient-to-b from-gray-100 to-white flex justify-center">
          
        {!isLoggedIn ? (
          /* LOGIN REQUIRED */
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
              Login Required
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
        ) : (
          /* SELL FORM */
          <motion.form
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl"
          >
            <h2 className="text-2xl font-bold text-center">
              List Your Land
            </h2>

            <div className="mt-6">
              <label className="text-sm font-medium">Location</label>
              <input
                className="mt-1 w-full border rounded-md px-4 py-3"
                placeholder="Village, Taluka, District"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Area (Bigha)</label>
              <input
                type="number"
                className="mt-1 w-full border rounded-md px-4 py-3"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Expected Price</label>
              <input
                className="mt-1 w-full border rounded-md px-4 py-3"
                placeholder="₹ Total Price"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Upload Images</label>
              <input type="file" multiple className="mt-1 w-full" />
            </div>

            <button className="mt-8 w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Submit Property
            </button>
          </motion.form>
        )}

      </section>
    </div>
  );
};

export default Sell;
