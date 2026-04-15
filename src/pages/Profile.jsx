import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, LogOut } from "lucide-react";
import { getCurrentUser } from "../Api/usrs"; // ✅ tumhara API
import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../Api/auth";  // agar logout API hai

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const navigation = useNavigate();



  // ✅ Fetch Current User

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        console.log(res)
        if (isMounted) setUser(res);
      } catch (error) {
        console.log("Profile user fetch failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigation("/");
    
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-amber-900 font-semibold text-lg">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-red-600 font-semibold text-lg">
          User not found / Login required
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="w-8 h-8 text-amber-800" />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-amber-900">
                {user?.name || "User"}
              </h1>
              <p className="text-sm text-amber-700">
                Welcome to your profile dashboard
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <h2 className="text-lg font-bold text-amber-900 mb-4">
              Basic Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-semibold text-amber-900">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold text-amber-900">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold text-amber-900">
                    {user?.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
            <h2 className="text-lg font-bold text-amber-900 mb-4">
              Account Details
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-700" />
                <div>
                  <p className="text-gray-500">Role</p>
                  <p className="font-semibold text-amber-900">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-gray-500">User ID</p>
                <p className="font-mono text-xs text-amber-900 break-all">
                  {user?.id}
                </p>
              </div>

              <div className="pt-2">
                <button
                  className="w-full bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700 transition shadow-md"
                  onClick={() => alert("Edit Profile feature add karna hai")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-amber-200">
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            Your Activity
          </h2>
          <p className="text-sm text-gray-600">
            Yaha tum future me booking history, payments, active seat, shift
            info show kar sakte ho 🔥
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
