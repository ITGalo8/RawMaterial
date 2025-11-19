import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
import { useUser } from '../../Context/UserContext'
import "./Login.css";


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
  const { login } = useUser(); // Get login function from context

  useEffect(() => {
    const fetchRoles = async () => {
      setRoleLoading(true);
      try {
        const response = await Api.get(`/common/showRole`);
        setRoles(response.data.data || []);
      } catch (err) {
        console.log(err?.response?.data || err.message);
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
      console.log("res data", response.data)
      if (!response.data.success) {
        throw new Error("Login failed. Please try again.");
      }
      const userData = response.data.data;
      const roleName = roles.find((r) => r.id === roleId)?.name;
      console.log("Logged in user role:", roleName);
      // Prepare user object for context
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: roleName,
        roleId: roleId,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken
      };

      // Store in localStorage (keep your existing storage)
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName);

      // Set axios default headers
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.accessToken}`;

      // Use context login function to update global state
      login(user, userData.accessToken);

      // Navigate based on role
      if (roleName === "Admin" || roleName === "SuperAdmin" || roleName === "Superadmin") {
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
      }else if(roleName === "Testing"){
        
        navigate("/pending-process");
      } 
      else if(roleName === "Purchase"){
        
        navigate("/purchase-dashboard");
      } 
      else if (roleName === "Store") {
        console.log("store")
        navigate("/store-keeper");
      } else {
        console.log("else condition")
        // Default redirect for other roles
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back!</h2>
            <p>Please enter your credentials.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={roleId}
                onChange={(e) => {
                  setError("");
                  setRoleId(e.target.value);
                }}
                disabled={roleLoading}
              >
                <option value="">
                  {roleLoading ? "Loading roles..." : "Select Role"}
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || roleLoading}
              className="login-button"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;