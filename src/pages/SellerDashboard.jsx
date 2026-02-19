import { Link, Outlet } from "react-router-dom";
import SellerNavBar from "../components/SellerNavBar";


const SellerDashboard = () => {
  return (
    
    <div className="min-h-screen bg-gray-50">
      <SellerNavBar/>

      {/* HERO SECTION */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-12">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              SELL YOUR LAND WITH <br /> CONFIDENCE
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              List your agricultural property easily and connect with serious buyers.
              Manage all your listings from one powerful dashboard.
            </p>

            <Link
              to="/seller/add-property"
              className="inline-block mt-8 bg-emerald-600 text-white px-8 py-3 rounded-lg shadow hover:bg-emerald-700 transition"
            >
              List Your Land Now
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
              alt="Farmland"
              className="rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* DASHBOARD LAYOUT */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-emerald-600 mb-8">
            Seller Panel
          </h2>

          <ul className="space-y-4">
            <li>
              <Link
                to="/seller/add-property"
                className="block p-2 rounded hover:bg-emerald-100"
              >
                Add Property
              </Link>
            </li>

            <li>
              <Link
                to="/seller/my-properties"
                className="block p-2 rounded hover:bg-emerald-100"
              >
                My Properties
              </Link>
            </li>
          </ul>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
