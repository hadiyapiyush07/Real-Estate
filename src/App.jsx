import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookMeeting from "./pages/BookMeeting";
import PropertyDetails from "./pages/PropertyDetails";
import AreaConverter from "./pages/AreaConverter";

/* NEW IMPORTS */
import SellerDashboard from "./pages/SellerDashboard";
import AddProperty from "./components/AddProperty";
import MyProperties from "./components/MyProperties";

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/property") ||
    location.pathname.startsWith("/seller");

  const hideFooterOnBuy = location.pathname.startsWith("/buy");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/meeting" element={<BookMeeting />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/area-converter" element={<AreaConverter />} />

        {/* SELLER ROUTES */}
        <Route path="/seller" element={<SellerDashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="my-properties" element={<MyProperties />} />
        </Route>

        {/* <Route path="/Buyer" element={<BuyerDashboard />} >
          <Route path="my-meetings" element={<MyMeetings />} />

        </Route>    */}

      </Routes>

      {!hideLayout && !hideFooterOnBuy && <Footer />}
    </>
  );
}

export default App;
