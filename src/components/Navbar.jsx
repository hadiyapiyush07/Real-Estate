import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Determine if the current user is a seller based solely on user.role
  const isSeller = user?.role === "seller";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper to display the correct initial in the profile circle
  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  // Helper to get a friendly name for "Hello, ..."
  const getDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  return (
    <nav className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">

          {/* LEFT MENU */}
          <div className="flex items-center gap-6">
            {/* Home link – goes to dashboard for sellers, homepage otherwise */}
            <NavLink to={isSeller ? "/seller" : "/"}>Home</NavLink>

            {/* Show Add Property only for sellers */}
            {isSeller && (
              <NavLink to="/seller/add-property">Add Property</NavLink>
            )}

            {/* Show other links only if user is NOT a seller */}
            {(!user || !isSeller) && (
              <>
                <NavLink to="/buy">Buy</NavLink>
                <NavLink to="/sell">Sell</NavLink>
                <NavLink to="/area-converter">Area Converter</NavLink>
              </>
            )}
          </div>

          {/* CENTER LOGO – goes to dashboard for sellers, homepage otherwise */}
          <Link
            to={isSeller ? "/seller" : "/"}
            className="text-center leading-tight cursor-pointer group"
          >
            <h1 className="text-2xl font-extrabold text-black group-hover:text-emerald-600 transition">
              ANAND CORPORATION
            </h1>
          </Link>

          {/* RIGHT MENU – changes based on login state */}
          <div className="flex items-center justify-end gap-6 flex-nowrap">
            {user ? (
              <>
                {/* Profile Circle (clickable to profile page) */}
                <div 
                  onClick={() => navigate("/profile")}
                  className="bg-emerald-600 text-white w-9 h-9 rounded-full flex items-center justify-center font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                >
                  {getInitial()}
                </div>

                {/* User Info */}
                <div className="text-sm hidden sm:block">
                  <p className="font-medium">
                    Hello, {getDisplayName()}
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
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-emerald-600 transition"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

/* Reusable NavLink */
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative text-sm font-medium text-gray-900
               after:absolute after:left-0 after:-bottom-1
               after:h-[2px] after:w-0 after:bg-emerald-500
               after:transition-all after:duration-300
               hover:after:w-full"
  >
    {children}
  </Link>
);