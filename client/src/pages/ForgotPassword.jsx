import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setResetToken(data.resetToken);
      toast.success("Reset token generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate reset token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Trax<span className="text-[#6E56CF]">ly</span></h1>
          <p className="text-[#888899] mt-2 text-sm">Reset your password</p>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8">
          {!resetToken ? (
            <>
              <h2 className="text-white font-semibold text-xl mb-2">Forgot Password</h2>
              <p className="text-[#888899] text-sm mb-6">Enter your email and we will generate a reset token for you.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#888899] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-4 py-2.5 text-[#EEEEEE] placeholder-[#444455] focus:outline-none focus:border-[#6E56CF] transition-colors text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6E56CF] hover:bg-[#5A42B0] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? "Generating..." : "Generate Reset Token"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-[#00D4AA]/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-white font-semibold text-lg">Reset Token Generated!</h2>
              <p className="text-[#888899] text-sm">Copy this token and use it to reset your password:</p>
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-3">
                <p className="text-[#6E56CF] font-mono text-xs break-all">{resetToken}</p>
              </div>
              <Link
                to={`/reset-password/${resetToken}`}
                className="block w-full bg-[#6E56CF] hover:bg-[#5A42B0] text-white py-2.5 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Reset Password Now
              </Link>
            </div>
          )}

          <p className="text-center text-[#888899] text-sm mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-[#6E56CF] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}