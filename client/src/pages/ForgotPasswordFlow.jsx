import React, { useState } from "react";
import ForgotPassword from "./forgotPwd/ForgotPassword";
import VerifyOTP from "./forgotPwd/VerifyOTP";
import ResetPassword from "./forgotPwd/ResetPassword";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetSuccess = () => {
    toast.success("successful! ");
    setTimeout(() => navigate("/Auth"), 1000);
  };

  const handleError = (msg) => {
    toast.error(msg || "Something went wrong. Try again.");
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[var(--card)] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Forgot Password
        </h1>

        {loading && (
          <div className="text-center text-gray-500 mb-4 animate-pulse">
            Loading...
          </div>
        )}

        {step === 1 && (
          <ForgotPassword
            onNext={(email) => {
              setLoading(true);
              setTimeout(() => {
                setEmail(email);
                toast.success("OTP sent to your email!");
                setStep(2);
                setLoading(false);
              }, 1000);
            }}
            onError={handleError}
          />
        )}

        {step === 2 && (
          <VerifyOTP
            email={email}
            onVerified={(otpValue) => {
              setOtp(otpValue);
              toast.success("OTP Verified!");
              setStep(3);
            }}
            onError={handleError}
          />
        )}

        {step === 3 && (
          <ResetPassword
            email={email}
            otp={otp}
            onSuccess={handleResetSuccess}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
