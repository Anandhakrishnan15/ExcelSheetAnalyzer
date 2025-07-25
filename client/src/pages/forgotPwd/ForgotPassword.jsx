import React, { useState } from "react";
import { sendOTP } from "../../services/AuthAPI";

const ForgotPassword = ({ onNext, onError }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOTP(email);
      onNext(email);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border border-[var(--border)] rounded p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
};

export default ForgotPassword;
