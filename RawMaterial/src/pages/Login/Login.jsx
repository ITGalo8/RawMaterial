import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import { useUser } from "../../Context/UserContext";
import GaloEnergy from "../../assets/GaloEnergy.jpg";
import SingleSelect from "../../components/dropdown/SingleSelect";
import InputField from "../../components/InputField/InputField";
import Button from '../../components/Button/Button'

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

      // Save to localStorage
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.accessToken}`;

      login(user, userData.accessToken);

      // Navigation based on role
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
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
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
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={GaloEnergy}
            alt="Galo Energy Logo"
            className="h-14 w-auto mx-auto object-contain drop-shadow-sm"
          />
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Powering Tomorrow With Smart Energy Solutions
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Login to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <SingleSelect
            lists={roles}
            selectedValue={roleId}
            setSelectedValue={setRoleId}
            label="Select Role"
          />

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
              label="Enter Password"
              type={showPassword ? "text" : "password"} // ← Fix
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {/* <Button
              title={showPassword ? "👁️" : "👁️‍🗨️"}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 px-2 py-1 bg-transparent hover:bg-transparent shadow-none"
            /> */}

            <Button
              title={showPassword ? "👁️" : "👁️‍🗨️"}
              type="button"
              variant="icon" // ← fixes padding + bg
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          <Button
            title={loading ? "Logging in..." : "Login"}
            type="submit"
            disabled={loading || roleLoading}
            className="w-full py-3 text-base md:text-lg"
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
