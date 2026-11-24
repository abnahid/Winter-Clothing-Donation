import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, authErrorMessage } from "../context/AuthProvider";

const UpdateProfile = () => {
  const { updateUserProfile, user } = useContext(AuthContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const name = e.target.name.value;
    const photoURL = e.target.photoUrl.value.trim();

    try {
      await updateUserProfile({ displayName: name, photoURL });
      toast.success("Profile updated successfully!");
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(authErrorMessage(error) || "Failed to update profile");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="py-11">
      <Helmet>
        <title>Update Profile - Warm Hearts</title>
      </Helmet>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          প্রোফাইল হালনাগাদ
        </h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              নাম:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user?.displayName || ""}
              required
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-gray-700"
            >
              ছবির লিংক (ঐচ্ছিক):
            </label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              defaultValue={user?.photoURL || ""}
              placeholder="https://..."
              className="input input-bordered w-full mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className={`btn bg-primary hover:bg-blue-500 text-white w-full flex items-center justify-center ${
              btnLoading ? "cursor-not-allowed opacity-75" : ""
            }`}
          >
            {btnLoading ? (
              <div className="flex justify-center items-center gap-2">
                <span className="loading loading-spinner loading-md"></span>
                <p>হালনাগাদ হচ্ছে...</p>
              </div>
            ) : (
              "প্রোফাইল হালনাগাদ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
