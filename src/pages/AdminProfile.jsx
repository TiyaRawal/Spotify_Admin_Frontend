import React, { useState } from "react";
import "../styles/AdminProfile.css";
import axios from "axios";
import cookie from "js-cookie";

function AdminProfile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const HandleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const HandleCancel = () => {
    setShowPasswordForm(false);
    setShowPasswords(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setMessage({ type: "", text: "" });
  };

  const HandleChangePassword = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Please fill all password fields.",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password.",
      });
      return;
    }

    try {
      setLoading(true);

      const token = cookie.get("admintoken");

      if (!token) {
        setMessage({
          type: "error",
          text: "Admin token not found. Please login again.",
        });
        return;
      }

      const response = await axios.put(
        "http://localhost:8000/adminchangepassword",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage({
        type: "success",
        text: response.data.message || "Password changed successfully.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your admin account and security settings.</p>
        </div>
      </div>

      <div className="admin-profile-layout">
        <div className="admin-profile-card">
          <div className="admin-profile-avatar">
            <i className="fa-solid fa-user"></i>
          </div>

          <h2>Spotify Admin</h2>
          <p className="admin-profile-role">Administrator</p>

          <div className="admin-profile-status">
            <span className="admin-profile-status-dot"></span>
            Admin Account
          </div>

          <div className="admin-profile-card-divider"></div>

          <div className="admin-profile-card-info">
            <div>
              <i className="fa-solid fa-shield-halved"></i>
              <span>Administrator Access</span>
            </div>

            <div>
              <i className="fa-solid fa-music"></i>
              <span>Spotify Management Panel</span>
            </div>
          </div>
        </div>

        <div className="admin-profile-content">
          <div className="admin-profile-section">
            <div className="admin-profile-section-heading">
              <div className="admin-profile-section-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <h3>Account Information</h3>
                <p>Your administrator account details</p>
              </div>
            </div>

            <div className="admin-profile-info-grid">
              <div className="admin-profile-info-item">
                <label>Full Name</label>
                <div className="admin-profile-info-value">
                  <i className="fa-regular fa-user"></i>
                  <span>Spotify Admin</span>
                </div>
              </div>

              <div className="admin-profile-info-item">
                <label>Email Address</label>
                <div className="admin-profile-info-value">
                  <i className="fa-regular fa-envelope"></i>
                  <span>spotify@gmail.com</span>
                </div>
              </div>

              <div className="admin-profile-info-item">
                <label>Account Role</label>
                <div className="admin-profile-info-value">
                  <i className="fa-solid fa-user-shield"></i>
                  <span>Administrator</span>
                </div>
              </div>

              <div className="admin-profile-info-item">
                <label>Account Type</label>
                <div className="admin-profile-info-value">
                  <i className="fa-solid fa-headphones"></i>
                  <span>Spotify Admin Panel</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-profile-section admin-profile-security">
            <div className="admin-profile-section-heading">
              <div className="admin-profile-section-icon">
                <i className="fa-solid fa-lock"></i>
              </div>

              <div>
                <h3>Security</h3>
                <p>Keep your administrator account secure</p>
              </div>
            </div>

            <div className="admin-profile-security-row">
              <div className="admin-profile-security-info">
                <i className="fa-solid fa-key"></i>

                <div>
                  <h4>Password</h4>
                  <p>Update your password to keep your account secure.</p>
                </div>
              </div>

              <button
                type="button"
                className="admin-profile-password-btn"
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setMessage({ type: "", text: "" });
                }}
              >
                {showPasswordForm ? "Close Form" : "Change Password"}
                <i
                  className={`fa-solid ${
                    showPasswordForm ? "fa-chevron-up" : "fa-arrow-right"
                  }`}
                ></i>
              </button>
            </div>

            {showPasswordForm && (
              <form
                className="admin-change-password-form"
                onSubmit={HandleChangePassword}
              >
                <h3>Change Your Password</h3>
                <p>Enter your current password and choose a new one.</p>

                <div className="admin-password-field">
                  <label>Current Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={HandleChange}
                  />
                </div>

                <div className="admin-password-field">
                  <label>New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={HandleChange}
                  />
                </div>

                <div className="admin-password-field">
                  <label>Confirm New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={HandleChange}
                  />
                </div>

                <label className="admin-show-password">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                  />
                  Show passwords
                </label>

                {message.text && (
                  <div className={`admin-password-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="admin-password-actions">
                  <button
                    type="button"
                    className="admin-password-cancel"
                    onClick={HandleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-password-submit"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;