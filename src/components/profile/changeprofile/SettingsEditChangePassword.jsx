"use client";
import React, { useState } from "react";
import PasswordField from "./PasswordField";
import SaveButton from "./SaveButton";
import { useUserAuth } from "../../../context/UserAuthContext";

const SettingsEditChangePassword = () => {
  const { fetchWithAuth } = useUserAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth("/users/change-password", {
        method: "POST",
        data: {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        }
      });

      setSuccess(response.data.message || "Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="overflow-hidden pt-3 pb-44 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <form onSubmit={handleSaveChanges} className="flex flex-col items-start px-9 py-7 w-full rounded-xl bg-[var(--card)]">
        <h2 className="text-sm font-medium text-neutral-400">Change Password</h2>
        <div className="mt-5 ml-4 text-xs w-full">
          <PasswordField label="Old Password" value={passwords.oldPassword} onChange={handleChange("oldPassword")} />
          <PasswordField label="New Password" value={passwords.newPassword} onChange={handleChange("newPassword")} />
          <PasswordField label="Confirm Password" value={passwords.confirmPassword} onChange={handleChange("confirmPassword")} />
        </div>

        {error && <div className="mt-4 ml-4 text-xs text-red-500">{error}</div>}
        {success && <div className="mt-4 ml-4 text-xs text-green-500">{success}</div>}
        <SaveButton type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </SaveButton>
      </form>
    </section>
  );
};

export default SettingsEditChangePassword;
