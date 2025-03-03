"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const initial = {
    name: "",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initial);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isPersonalLoading, setIsPersonalLoading] = useState(false); // ✅ Personal Info Loading
  const [isPasswordLoading, setIsPasswordLoading] = useState(false); // ✅ Password Change Loading

  // ✅ fetch form data when session is loaded
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/");
        const data = await res.json();
        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
        if (data.error) throw new Error(data.error);
      } catch (err) {
        console.error("Failed to fetch user :", err.message);
      }
    };

    fetchUser();
  }, [session]);

  // ✅ Handle Personal Info Update
  const handlePersonalChange = async (e) => {
    e.preventDefault();
    setIsPersonalLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/user/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setMessage("✅ Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPersonalLoading(false);
    }
  };

  // ✅ Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setMessage("");
    setError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("❌ New passwords do not match");
      setIsPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (!res.ok) throw new Error("Incorrect old password or error occurred");

      setMessage("✅ Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // ✅ Loading & Authentication Check
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in to view this page.</p>;

  return (
    <div className="container mx-auto p-6 bg-foreground rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">⚙️ User Settings</h1>

      {/* ✅ Success & Error Messages */}
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* 👤 Personal Info Form */}
      <form onSubmit={handlePersonalChange} className="space-y-4">
        <h2 className="text-lg font-semibold">👤 Personal Information</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={isPersonalLoading}
          className={`w-full py-2 rounded-lg text-white ${
            isPersonalLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isPersonalLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <hr className="my-6" />

      {/* 🔒 Password Change Form */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h2 className="text-lg font-semibold">🔒 Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, oldPassword: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isPasswordLoading}
          className={`w-full py-2 rounded-lg text-white ${
            isPasswordLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isPasswordLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
