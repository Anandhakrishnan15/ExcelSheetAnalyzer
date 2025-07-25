import React, { useState } from "react";
import { verifyOTP } from "../../services/AuthAPI";

const VerifyOTP = ({ email, onVerified, onError }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      onVerified(otp);
    } catch (err) {
      onError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full border rounded p-2"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default VerifyOTP;
