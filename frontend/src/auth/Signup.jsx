import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
    
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  
  const [loading, setLoading] = useState(false);

  // Shake animation state for invalid fields
  const [shakeFields, setShakeFields] = useState({});

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for scrolling/focusing to invalid fields
  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        return null;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        return null;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) 
          ///^\S+@\S+\.\S+$/
          return "Enter a valid email address";
        return null;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) 
          return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value)) 
          return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(value))
          return "Password must contain at least one special character";
        return null;
      case "confirmPassword":
        if (value !== formData.password)
          return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  // Validate all fields/whole form at once on submit
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  //Handle input changes (live validation)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // live validate current single field being changed
    const error = validateField(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: error }));

    setServerError("");
  };
    const focusAndScroll = (fieldName) => {
    const el = inputRefs[fieldName]?.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({
        behavior: "smooth", 
        block: "center"
      });
      el.focus({preventScroll: true});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateAll();
    setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    //trigger shake animation for invalid fields
    const shakeMap = {};
    Object.keys(validationErrors).forEach((field) => {
      shakeMap[field] = true;
    });
    setShakeFields(shakeMap);

    // Clear shake class after animation duration
    setTimeout(() => setShakeFields({}), 500);


    // scroll + focus to first invalid field
    const firstErrorField = Object.keys(validationErrors)[0];
    focusAndScroll(firstErrorField);
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    // simulate a small delay to mimic server processing
    await new Promise((res) => setTimeout(res, 800));

    const user = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    //store session in localstorage
    localStorage.setItem("token", "dummy");
    localStorage.setItem("user", JSON.stringify(user));

    //redirect back
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
    
  };
  
  const getInputClass = (name) => {
    let base = "";
    if (touched[name]) {
      if (errors[name]){
        base = "error"; 
        // Force re-trigger animation
        if (shakeFields[name]) base += " shake"; //the second shake is optional
      } else {
        base = "success";
      }
    }
    return base;
    
  };
  return (
    <>
      <h1 className="register-title">Movie Explorer</h1>

      <div className="register-container">
        <div className="signup">
          <h2>Sign Up</h2>
          <span style={{ color: "gray", textAlign: "center" }}>
            <i>It's quick and easy!</i>
          </span>

          {serverError && (
            <div className="error-text" role="alert" aria-live="assertive">
              {serverError}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit} noValidate>

            {/* First Name */}
            <div className="form-group">
              <input
                ref={inputRefs.firstName}
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
                className={getInputClass("firstName")}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <span id="firstName-error" className="error-text">
                  {errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <input
                ref={inputRefs.lastName}
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
                className={getInputClass("lastName")}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <span id="lastName-error" className="error-text">
                  {errors.lastName}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                ref={inputRefs.email}
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                className={getInputClass("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="error-text">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group has-icon" style={{ position: "relative" }}>
              <input
                ref={inputRefs.password}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                className={getInputClass("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                // onClick={() => setShowPassword((prev) => !prev)}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  aria-hidden="true"
                />
              </button>
              {errors.password && (
                <span id="password-error" className="error-text">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group has-icon" style={{ position: "relative" }}>
              <input
                ref={inputRefs.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
                className={getInputClass("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                //onClick={() => setShowConfirmPassword((prev) => !prev)}
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <i
                  className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                  aria-hidden="true"
                />
              </button>
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="error-text">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit ...when Join Us button is clicked, it runs handleSubmit.*/}
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Signing up..." : "Join us →"}
            </button>
          </form>

          <p className="signup-prompt">
            Already have an account?{" "}
            <Link to="/login" className="loginhere-link">
              Login Here →
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

