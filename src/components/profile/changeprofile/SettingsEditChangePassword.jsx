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
      setError(err?.response?.data?.message || "Could not change your password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[480px]">
      <form onSubmit={handleSaveChanges} className="flex flex-col items-start w-full">
        <h2 className="text-[13px] font-semibold tracking-[-0.01em]">Change password</h2>
        <div className="mt-4 w-full">
          <PasswordField label="Old Password" value={passwords.oldPassword} onChange={handleChange("oldPassword")} />
          <PasswordField label="New Password" value={passwords.newPassword} onChange={handleChange("newPassword")} />
          <PasswordField label="Confirm Password" value={passwords.confirmPassword} onChange={handleChange("confirmPassword")} />
        </div>

        {error && <div className="mt-4 text-[12px] text-red-400">{error}</div>}
        {success && <div className="mt-4 text-[12px] text-emerald-400">{success}</div>}
        <SaveButton type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </SaveButton>
      </form>
    </section>
  );
};

export default SettingsEditChangePassword;
