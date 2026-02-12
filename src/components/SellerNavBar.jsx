import { Link, useNavigate } from "react-router-dom";

const SellerNavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT LINKS */}
        <div className="flex gap-6 items-center">
          <Link 
            to="/" 
            className="font-semibold hover:text-emerald-600 cursor-pointer"
          >
            Home
          </Link>
        </div>

        {/* CENTER LOGO */}
        <div 
          onClick={() => navigate("/seller-dashboard")}
          className="text-2xl font-bold text-emerald-600 cursor-pointer"
        >
          ANAND CORPORATION
        </div>

        {/* RIGHT PROFILE */}
        <div className="flex items-center gap-4">

          {/* Profile Circle */}
          <div className="bg-emerald-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold cursor-pointer">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="text-sm">
            <p className="font-medium">
              Hello, {user?.name}
            </p>
            <p className="text-gray-500 text-xs">
              {user?.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm hover:underline cursor-pointer"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;
