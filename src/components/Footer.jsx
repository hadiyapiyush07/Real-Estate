const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid gap-12 md:grid-cols-5">

          {/* BRAND */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-extrabold text-gray-900">
              ANAND CORPORATION
            </h2>
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
              <li className="hover:text-emerald-600 cursor-pointer">Buy Land</li>
              <li className="hover:text-emerald-600 cursor-pointer">Sell Land</li>
            </ul>
          </div>

          {/* TOOLS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Tools
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="hover:text-emerald-600 cursor-pointer">
                Area Converter
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="hover:text-emerald-600 cursor-pointer">
                About Us
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
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
