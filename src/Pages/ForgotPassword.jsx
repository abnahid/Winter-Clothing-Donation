import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, authErrorMessage } from "../context/AuthProvider";
import { useBranding } from "../context/BrandingContext";

const ForgotPassword = () => {
  const { resetPassword, setNewPassword, pendingRecovery } =
    useContext(AuthContext);
  const { settings } = useBranding();
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
      toast.success("পাসওয়ার্ড রিসেট লিংকের জন্য আপনার ইমেইল চেক করুন।", {
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
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    setBusy(true);
    try {
      await setNewPassword(password);
      toast.success("পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে।");
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
          {pendingRecovery ? "নতুন পাসওয়ার্ড সেট করুন" : "পাসওয়ার্ড ভুলে গেছেন"} - {settings.siteName}
        </title>
      </Helmet>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        {pendingRecovery ? (
          <>
            <h1 className="text-2xl font-bold text-center">নতুন পাসওয়ার্ড সেট করুন</h1>
            <form className="mt-6" onSubmit={handleNewPassword}>
              <input
                type="password"
                placeholder="নতুন পাসওয়ার্ড লিখুন"
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
                {busy ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড সংরক্ষণ"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">পাসওয়ার্ড ভুলে গেছেন</h1>
            <form className="mt-6" onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
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
                {busy ? "পাঠানো হচ্ছে…" : "পাসওয়ার্ড রিসেট"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
