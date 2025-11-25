import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import { useUser } from "../../Context/UserContext";
import "./Login.css";
import GaloEnergy from "../../assets/GaloEnergy.JPG";

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const fetchRoles = async () => {
      setRoleLoading(true);
      try {
        const response = await Api.get(`/common/showRole`);
        setRoles(response.data.data || []);
      } catch (err) {
        setError("Unable to load roles. Please try again later.");
      } finally {
        setRoleLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await Api.post(
        `/auth/login`,
        { email, password, roleId },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error("Login failed. Please try again.");
      }

      const userData = response.data.data;
      const roleName = roles.find((r) => r.id === roleId)?.name;

      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: roleName,
        roleId: roleId,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };

      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName);

      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.accessToken}`;

      login(user, userData.accessToken);

      if (
        roleName === "Admin" ||
        roleName === "SuperAdmin" ||
        roleName === "Superadmin"
      ) {
        navigate("/admin-dashboard");
      } else if (
        roleName === "SFG Work" ||
        roleName === "Assemble" ||
        roleName === "Disassemble" ||
        roleName === "Stamping" ||
        roleName === "Winding" ||
        roleName === "Winding Connection"
      ) {
        navigate("/Item-Request");
      } else if (roleName === "Testing") {
        navigate("/pending-process");
      } else if (roleName === "Purchase") {
        navigate("/purchase-dashboard");
      } else if (roleName === "Store") {
        navigate("/store-keeper");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !roleId) {
      setError("Please fill in all fields.");
      return;
    }
    fetchData();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-white p-4">

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fadeIn">

        {/* Logo + Brand Name */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <img
              src={GaloEnergy}
              alt="Galo Energy Logo"
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
            />
            {/* <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 tracking-wide">
              Galo Energy
            </h1> */}
          </div>

          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Powering Tomorrow With Smart Energy Solutions
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 bg-red-50 border border-red-200 p-2 rounded-lg text-center text-sm md:text-base mb-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Select Role</label>
            <select
              value={roleId}
              onChange={(e) => { setError(""); setRoleId(e.target.value); }}
              disabled={roleLoading}
              className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">
                {roleLoading ? "Loading roles..." : "Choose your role"}
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Login Btn */}
          <button
            type="submit"
            disabled={loading || roleLoading}
            className="w-full py-2 md:py-3 bg-yellow-500 text-white font-semibold rounded-xl text-sm md:text-lg hover:scale-[1.03] transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Galo Energy • All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Login;
