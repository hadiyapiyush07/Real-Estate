import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Home, Send, LogIn } from "lucide-react";

const BookMeeting = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    property: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Booking data:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        property: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left side – image & info (unchanged) */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-emerald-600 to-teal-600 p-8 lg:p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Book a Meeting</h2>
              <p className="text-emerald-100 text-lg mb-8">
                Schedule a one-on‑one consultation with our expert real estate advisors. We’ll help you find the perfect land or property.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-200" />
                  <span>Choose a date that works for you</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-200" />
                  <span>Flexible time slots available</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-200" />
                  <span>Meet with experienced brokers</span>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <div className="border-t border-emerald-400 pt-6">
                <p className="text-sm text-emerald-100">📞 +91 98765 43210</p>
                <p className="text-sm text-emerald-100 mt-1">✉️ meetings@anandcorporation.com</p>
              </div>
            </div>
          </div>

          {/* Right side – form or login prompt */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            {!user ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full py-12 text-center"
              >
                <div className="bg-emerald-100 rounded-full p-4 mb-4">
                  <LogIn className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to book a meeting.
                </p>
                <button
                  onClick={() => navigate("/login", { state: { from: "/meeting" } })}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  Go to Login
                </button>
              </motion.div>
            ) : submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-12"
              >
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                <p className="text-gray-600 text-center">
                  We’ll contact you shortly to confirm your meeting.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Fill in your details</h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-sm`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-sm`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-sm`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Property of Interest (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-600" /> Property of Interest (optional)
                  </label>
                  <input
                    type="text"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-sm"
                    placeholder="e.g. Agricultural land in Ahmedabad"
                  />
                </div>

                {/* Message (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> Additional Notes (optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition shadow-sm"
                    placeholder="Any specific requirements or questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Request Meeting
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookMeeting;