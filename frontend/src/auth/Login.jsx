import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // this is the shake state for animations (keeps parity with Signup)
  const [shakeFields, setShakeFields] = useState({});

  // using userefs to focus on first invalid input
  const emailRef = useRef();
  const passwordRef = useRef();

  // Field Validation
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
          return "Enter a valid email address";
        return null;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return null;
      default:
        return null;
    }
  };

  // handle input change (clears field error on type)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setServerError("");
  };

  const focusAndScroll = (ref) => {
    const el = ref?.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // validate all
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // trigger shake animation for invalid fields
      const shakeMap = {};
      Object.keys(newErrors).forEach((f) => (shakeMap[f] = true));
      setShakeFields(shakeMap);
      setTimeout(() => setShakeFields({}), 500);

      // focus first invalid field
      const first = Object.keys(newErrors)[0];
      if (first === "email") focusAndScroll(emailRef);
      else if (first === "password") focusAndScroll(passwordRef);
      return;
    }

    setLoading(true);
    try {
      // simulate server login check
      await new Promise((res) => setTimeout(res, 800));

      //the dummy token and minimal user info
      localStorage.setItem("token", "dummy");
      localStorage.setItem("user", JSON.stringify({ email: formData.email }));

      // Redirect to protected route
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (name) => {
    let base = "";
    if (touched[name]) {
      if (errors[name]) {
        base = "error";
        if (shakeFields[name]) base += " shake";
      } else {
        base = "success";
      }
    }
    return base;
  };

  return (
    <>
      <div className="register-container">
        <div className="signup">
          <h2>Login</h2>

          {serverError && (
            <div className="error-text" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <div className="form-group">
              <input
                ref={emailRef}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
                className={getInputClass("email")}
              />
              {errors.email && (
                <span id="email-error" className="error-text">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group has-icon" style={{ position: "relative" }}>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
                className={getInputClass("password")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
              {errors.password && (
                <span id="password-error" className="error-text">
                  {errors.password}
                </span>
              )}
            </div>

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Logging in..." : "Login with Email →"}
            </button>
          </form>
          {/*The forgot password is not working as at now but will do later.*/}
          <Link to="/forgot-password" className="loginhere-link">
            Forgot password?
          </Link>
          <p className="signup-prompt">
            Don’t have an account?{" "}
            <Link to="/signup" className="loginhere-link">
              Register Here →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
