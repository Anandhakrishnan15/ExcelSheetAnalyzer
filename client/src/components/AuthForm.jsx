import React, { useState } from "react";
import "./styles/Auth.css";
import { loginUser, registerUser } from "../services/AuthAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login,isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   // Show a toast while promise is pending
   setLoading(true);

   const authPromise = isSignup ? registerUser(formData) : loginUser(formData);

   toast.promise(authPromise, {
     pending: `${isSignup ? "Signing up" : "Logging in"}...`,
     success: `${isSignup ? "Signup" : "Login"} successful!`,
     error: {
       render({ data }) {
         // You can customize error messages
         const message =
           data?.response?.data?.message ||
           data?.message ||
           "Authentication failed.";
         return message;
       },
     },
   });

   try {
     const res = await authPromise;

     const { token } = res.data;

     login(token);
     navigate("/profile");
   } catch (err) {
     console.error("Auth error:", err);
     // Error is handled by toast.promise error renderer
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {!isSignup && (
          <p className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
