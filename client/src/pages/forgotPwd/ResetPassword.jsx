import React, { useState } from "react";
import { resetPassword } from "../../services/AuthAPI";
import { Eye, EyeOff } from "lucide-react"; // Optional: change if using another icon library

const ResetPassword = ({ email, otp, onSuccess, onError }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const handleReset = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      onError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword: password });
      onSuccess();
    } catch (err) {
      onError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          className="w-full border rounded p-2 pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>

      {/* Confirm Password */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm password"
        className="w-full border rounded p-2"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {/* Password Mismatch Warning */}
      {!passwordsMatch && confirmPassword && (
        <p className="text-sm text-red-600">Passwords do not match.</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !passwordsMatch}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
