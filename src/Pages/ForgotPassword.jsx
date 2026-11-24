import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, authErrorMessage } from "../context/AuthProvider";

const ForgotPassword = () => {
  const { resetPassword, setNewPassword, pendingRecovery } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await resetPassword(email);
      toast.success("Check your email for a password reset link.", {
        duration: 5000,
      });
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setBusy(true);
    try {
      await setNewPassword(password);
      toast.success("Password updated.");
      navigate("/");
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-11">
      <Helmet>
        <title>
          {pendingRecovery ? "Set New Password" : "Forgot Password"} - Warm
          Hearts
        </title>
      </Helmet>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        {pendingRecovery ? (
          <>
            <h1 className="text-2xl font-bold text-center">Set New Password</h1>
            <form className="mt-6" onSubmit={handleNewPassword}>
              <input
                type="password"
                placeholder="Enter a new password"
                className="w-full border border-gray-300 px-4 py-3 rounded-md outline-primary mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-primary text-white py-2 rounded-md disabled:opacity-75"
              >
                {busy ? "Saving..." : "Save Password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            <form className="mt-6" onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-3 rounded-md outline-primary mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-primary text-white py-2 rounded-md disabled:opacity-75"
              >
                {busy ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
