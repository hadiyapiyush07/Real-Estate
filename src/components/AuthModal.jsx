import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthModal = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("signup");
  const [role, setRole] = useState("buyer");
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    loginEmail: "",
    loginPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ================= VALIDATION ================= */

  const validateSignup = () => {
    let err = {};

    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";

    if (!form.email.trim())
      err.email = "Email is required";
    else if (!emailRegex.test(form.email))
      err.email = "Invalid email format";

    if (!form.phone.trim())
      err.phone = "Phone number is required";
    else if (form.phone.length !== 10)
      err.phone = "Phone must be 10 digits";

    if (!form.password)
      err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters required";

    if (!form.confirmPassword) {
      err.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateSignin = () => {
    let err = {};

    if (!form.loginEmail)
      err.loginEmail = "Email is required";
    else if (!emailRegex.test(form.loginEmail))
      err.loginEmail = "Invalid email";

    if (!form.loginPassword)
      err.loginPassword = "Password is required";
    else if (form.loginPassword.length < 8)
      err.loginPassword = "Password must be at least 8 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSignup = () => {
    if (!validateSignup()) return;

    alert("Account created successfully ✅");

    localStorage.setItem("userRole", role);

    setTimeout(() => {
      if (role === "seller") {
        navigate("/seller/add-property");
      } else {
        navigate("/");
      }
    }, 500);
  };

  const handleSignin = () => {
    if (!validateSignin()) return;

    alert("Logged in successfully ✅");

    const savedRole = localStorage.getItem("userRole") || "buyer";

    setTimeout(() => {
      if (savedRole === "seller") {
        navigate("/seller/add-property");
      } else {
        navigate("/");
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl px-8 py-6"
    >
      {/* CLOSE */}
      <button
        onClick={() => navigate("/")}
        className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
      >
        <X />
      </button>

      <h2 className="text-xl font-bold text-center mb-6">
        Welcome to ANAND CORPORATION
      </h2>

      {/* TABS */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setTab("signin")}
          className={`cursor-pointer flex-1 pb-2 ${
            tab === "signin"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-400"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`cursor-pointer flex-1 pb-2 ${
            tab === "signup"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-400"
          }`}
        >
          New Account
        </button>
      </div>

      {/* ================= SIGN IN ================= */}
      {tab === "signin" && (
        <div className="space-y-4">
          <input
            name="loginEmail"
            placeholder="Email"
            onChange={handleChange}
            className="input"
          />
          {errors.loginEmail && (
            <p className="text-red-500 text-xs">{errors.loginEmail}</p>
          )}

          <input
            name="loginPassword"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
          />
          {errors.loginPassword && (
            <p className="text-red-500 text-xs">{errors.loginPassword}</p>
          )}

          <p className="text-sm text-emerald-600 text-right cursor-pointer">
            Forgot password?
          </p>

          <button
            onClick={handleSignin}
            className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      )}

      {/* ================= SIGN UP ================= */}
      {tab === "signup" && (
        <div className="space-y-4">
          {/* PHOTO + ROLE */}
          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {image ? (
                  <img src={image} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-500">Upload</span>
                )}
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setImage(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>

            <div className="flex gap-4">
              {["buyer", "seller"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-6 py-2 rounded-md border transition ${
                    role === r
                      ? "bg-emerald-600 text-white cursor-pointer"
                      : "text-gray-600 cursor-pointer"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* FIRST + LAST */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="input"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="input"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="input"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD INPUT */}
            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 cursor-pointer"
          >
            Create Account
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AuthModal;