import { Link, useNavigate } from "react-router-dom";

const SellerNavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get display initial
  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <nav className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">

          {/* LEFT LINKS */}
          <div className="flex items-center gap-6">
            
          </div>

          {/* CENTER LOGO */}
          <div 
            onClick={() => navigate("/seller-dashboard")}
            className="text-center leading-tight cursor-pointer group"
          >
            <h1 className="text-2xl font-extrabold text-black group-hover:text-emerald-700 transition-colors">
              ANAND CORPORATION
            </h1>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-end gap-6 flex-nowrap">
            {user ? (
              <>
                {/* Profile Circle */}
                <div 
                  onClick={() => navigate("/profile")}
                  className="bg-emerald-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold cursor-pointer hover:bg-emerald-700 transition-colors shadow-md"
                >
                  {getInitial()}
                </div>

                {/* User Info */}
                <div className="text-sm hidden sm:block">
                  <p className="font-medium">
                    Hello, {user?.firstName || user?.name || user?.email?.split('@')[0]}
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
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;