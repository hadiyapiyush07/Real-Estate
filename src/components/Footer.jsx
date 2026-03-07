import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid gap-12 md:grid-cols-5">

          {/* BRAND (links to home) */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-extrabold text-gray-900 hover:text-emerald-600 transition">
                ANAND CORPORATION
              </h2>
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              ANAND CORPORATION is a trusted real-estate platform helping buyers
              and sellers connect with verified land listings, expert brokers,
              and transparent processes across India.
            </p>
          </div>

          {/* BUY / SELL */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Buy & Sell
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/buy" className="hover:text-emerald-600 transition">
                  Buy Land
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-emerald-600 transition">
                  Sell Land
                </Link>
              </li>
            </ul>
          </div>

          {/* TOOLS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Tools
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/area-converter" className="hover:text-emerald-600 transition">
                  Area Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="hover:text-emerald-600 transition cursor-pointer">
                  About Us
              </li>
             <li className="hover:text-emerald-600 transition cursor-pointer">
                  Contact Us
              </li>
              <li className="hover:text-emerald-600 transition cursor-pointer">
                  Privacy Policy
              </li>
              <li className="hover:text-emerald-600 transition cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ANAND CORPORATION. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;