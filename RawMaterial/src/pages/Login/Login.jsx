// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";
// axios.defaults.withCredentials = true;
// import Api from "../../auth/Api"

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [roleId, setRoleId] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [roleLoading, setRoleLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRoles = async () => {
//       setRoleLoading(true);
//       try {
//         const response = await Api.get(`/common/showRole`);
//         console.log("response data", response.data);
//         setRoles(response.data.data || []);
//       } catch (err) {
//         console.log(err?.response?.data || err.message);
//         setError("Unable to load roles. Please try again later.");
//       } finally { 
//         setRoleLoading(false);
//       }
//     };
//     fetchRoles();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await Api.post(
//         `/auth/login`,
//         {
//           email,
//           password,
//           roleId,
//         },
//         { withCredentials: true }
//       );

//       localStorage.setItem("accessToken", response.data.data.accessToken);
//       localStorage.setItem("refreshToken", response.data.data.refreshToken);
//       localStorage.setItem("userId", response.data.data.id);
//       localStorage.setItem("userName", response.data.data.name);
//       localStorage.setItem("userEmail", response.data.data.email);

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.data.accessToken}`;

//       navigate('/dashboard');
//     } catch (error) {
//       const errorMessage =
//         error?.response?.data?.message || "Login failed. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password || !roleId) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     fetchData();
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <div className="login-card">
//           <div className="login-header">
//             <h2>Welcome Back!</h2>
//             <p>We are happy to see you again. Please enter your credentials.</p>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <form onSubmit={handleSubmit} className="login-form">
//             {/* Role */}
//             <div className="form-group">
//               <label htmlFor="role">Role</label>
//               <select
//                 id="role"
//                 value={roleId}
//                 onChange={(e) => {
//                   setError("");
//                   setRoleId(e.target.value);
//                 }}
//                 disabled={roleLoading}
//                 className={error && !roleId ? "error" : ""}
//               >
//                 <option value="">
//                   {roleLoading ? "Loading roles..." : "Select Role"}
//                 </option>
//                 {roles.map((role) => (
//                   <option key={role.id} value={role.id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Email */}
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 disabled={loading}
//                 required
//                 className={error && !email ? "error" : ""}
//               />
//             </div>

//             {/* Password */}
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <div style={{ position: "relative" }}>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   disabled={loading}
//                   required
//                   className={error && !password ? "error" : ""}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: "absolute",
//                     right: "10px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     fontSize: "1.2rem",
//                   }}
//                 >
//                   {showPassword ? "👁️" : "👁️‍🗨️"}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading || roleLoading}
//               className="login-button"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../auth/Api";
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

      // Save user info + role
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("userId", response.data.data.id);
      localStorage.setItem("userName", response.data.data.name);
      localStorage.setItem("userEmail", response.data.data.email);
      localStorage.setItem("roleId", roleId);

      const roleName = roles.find((r) => r.id === roleId)?.name;
      localStorage.setItem("roleName", roleName);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.data.accessToken}`;

      if (roleName === "Admin" || roleName === "SuperAdmin") {
        navigate("/admin-dashboard");
      } else if (roleName === "MPC Work" || roleName === "Assemble" || roleName === "Diassemble" || roleName === "Stamping" || roleName === "Store" || roleName === "Testing" || roleName === "Winding" || roleName === "Winding Connection") {
        navigate("/lineWorker-dashboard");
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
            {/* Role */}
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

            {/* Email */}
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

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
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
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Submit */}
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