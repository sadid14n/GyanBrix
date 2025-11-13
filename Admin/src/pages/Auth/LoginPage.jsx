import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase/firebaseConfig";

const Login = ({ onSwitch }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();

  // 🔹 Initialize reCAPTCHA once on component mount
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("✅ reCAPTCHA verified");
          },
          "expired-callback": () => {
            console.warn("⚠️ reCAPTCHA expired");
          },
        }
      );
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // 🔹 Send OTP
  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Please include your country code (e.g. +91)");
      return;
    }

    setLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      console.log("Sending OTP to:", phone);

      const result = await signInWithPhoneNumber(
        firebaseAuth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);
      setStep(2);
      console.log("✅ OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = new RecaptchaVerifier(
          firebaseAuth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("✅ reCAPTCHA verified");
            },
            "expired-callback": () => {
              console.warn("⚠️ reCAPTCHA expired");
            },
          }
        );
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter OTP");

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("✅ User signed in:", result.user);
      alert("Phone verified successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Invalid OTP:", error);
      alert("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-blue-600 text-center">
          Admin Portal
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Sign in with your phone number
        </p>

        {step === 1 ? (
          <>
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-3 text-blue-600 hover:underline text-sm"
            >
              ← Change Phone Number
            </button>
          </>
        )}

        {/* reCAPTCHA container - must be in the DOM */}
        <div id="recaptcha-container"></div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
