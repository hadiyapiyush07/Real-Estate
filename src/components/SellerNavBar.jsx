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
          <Link to="/" className="font-semibold">Home</Link>
        </div>

        {/* CENTER LOGO */}
        <div className="text-2xl font-bold">
          <span className="text-emerald-600">ANAND CORPORATION</span>
        </div>

        {/* RIGHT PROFILE */}
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm">
            Hello, {user?.email?.split("@")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;
