import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import { useUser } from "../../Context/UserContext";
import GaloEnergy from "../../assets/GaloEnergy.jpg";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await Api.post("/auth/login", {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error("Login failed");
      }

      const userData = response.data.data;

      // 🔹 Create user object
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        warehouseId: userData.warehouseId,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      };

      // 🔹 Save to localStorage
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("roleName", userData.role);
      localStorage.setItem("warehouseId", userData.warehouseId);

      // 🔹 Set axios auth header
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.accessToken}`;

      // 🔹 Save in context
      login(user, userData.accessToken);

      // 🔹 Role-based navigation
      switch (userData.role) {
        case "Admin":
        case "SuperAdmin":
        case "Superadmin":
          navigate("/admin-dashboard");
          break;

        case "Purchase":
          navigate("/purchase-dashboard");
          break;

        case "Store":
          navigate("/store-keeper");
          break;

        case "Testing":
          navigate("/pending-process");
          break;

        case "SFG Work":
        case "Assemble":
        case "Disassemble":
        case "Stamping":
        case "Winding":
        case "Winding Connection":
          navigate("/Item-Request");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={GaloEnergy}
            alt="Galo Energy"
            className="h-14 mx-auto object-contain"
          />
          <p className="text-gray-600 mt-2 text-sm">
            Powering Tomorrow With Smart Energy Solutions
          </p>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              title={showPassword ? "👁️" : "👁️‍🗨️"}
              type="button"
              variant="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <Button
            title={loading ? "Logging in..." : "Login"}
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg"
          />
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
