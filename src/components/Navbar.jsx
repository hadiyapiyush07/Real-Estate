import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">

          {/* LEFT MENU */}
          <div className="flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/buy">Buy</NavLink>
            <NavLink to="/sell">Sell</NavLink>
            <NavLink to="/area-converter">Area Converter</NavLink>
          </div>

          {/* CENTER LOGO (CLICKABLE) */}
          <Link
            to="/"
            className="text-center leading-tight cursor-pointer group"
          >
            
            <h1 className="text-2xl font-extrabold text-black group-hover:text-emerald-600 transition">
              ANAND CORPORATION
            </h1>
          </Link>

          {/* RIGHT MENU */}
          <div className="flex items-center justify-end gap-6">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-emerald-600 transition"
            > 
              Login
            </Link>
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
