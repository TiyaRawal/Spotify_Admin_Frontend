import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminUsers.css";
import api from "../../utils/AxiosConfig";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const GetUserId = (user) =>
    user?._id ?? user?.user_id ?? user?.userId ?? null;
  const GetUserName = (user) => user?.username || "Unnamed User";
  const GetUserEmail = (user) => user?.email || "No email";
  const GetUserImage = (user) => user?.profileImage || "";
  const GetCreatedAt = (user) => user?.createdAt || null;
  const FormatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const GetUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get("/adminusers");
      const userList = response.data.users;

      if (!Array.isArray(userList)) {
        throw new Error("Invalid users");
      }

      setUsers(userList);
    } catch (e) {
      console.error("Get Users Error:", e);

      setError(e.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    GetUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return users;

    return users.filter((user) =>
      GetUserName(user).toLowerCase().includes(searchText),
    );
  }, [users, search]);

  const OpenUserPlaylists = (user) => {
    const userId = GetUserId(user);

    if (userId === null || userId === undefined || userId === "") {
      setError("Unable to open User playlists.");
      return;
    }

    navigate(`/adminhome/adminusers/${String(userId)}/playlists`);
  };

  const DeleteUser = async (user) => {
    const userId = GetUserId(user);

    if (userId === null || userId === undefined || userId === "") {
      setError("User ID not found. Unable to delete this user.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${GetUserName(user)}?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await api.delete(
        `/adminusers/${String(userId)}`,
      );

      if (response.data.success) {
        setUsers((previous) =>
          previous.filter((item) => String(GetUserId(item)) !== String(userId)),
        );

        setMessage("User deleted successfully.");
      } else {
        setError(response.data.message || "Unable to delete user.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div>
          <p className="admin-users-eyebrow">USER MANAGEMENT</p>
          <h1>Users</h1>
          <p className="admin-users-subtitle">
            Manage registered users and view their playlists.
          </p>
        </div>

        <button
          type="button"
          className="admin-users-refresh-btn"
          onClick={GetUsers}
          disabled={loading}
        >
          <i className="fa-solid fa-rotate-right"></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message && <p className="admin-users-message">{message}</p>}
      {error && <p className="admin-users-error">{error}</p>}

      <div className="admin-users-summary">
        <div className="admin-users-summary-icon">
          <i className="fa-solid fa-users"></i>
        </div>

        <div>
          <p>Total Registered Users</p>
          <h2>{users.length}</h2>
        </div>
      </div>

      <div className="admin-users-toolbar">
        <div className="admin-users-search">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <span className="admin-users-count">
          Showing {filteredUsers.length} of {users.length} users
        </span>
      </div>

      {loading ? (
        <div className="admin-users-status">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-users-status">
          <i className="fa-solid fa-users"></i>

          <h3>{users.length === 0 ? "No users found" : "No matching users"}</h3>

          <p>
            {users.length === 0
              ? "Registered users will appear here."
              : "Try searching with a different name or email."}
          </p>
        </div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Playlists</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => {
                const userId = GetUserId(user);
                const name = GetUserName(user);
                const email = GetUserEmail(user);
                const image = GetUserImage(user);
                const createdAt = GetCreatedAt(user);

                return (
                  <tr key={userId ?? index}>
                    <td>
                      <div className="admin-users-user-cell">
                        <div className="admin-users-avatar">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="admin-users-user-info">
                          <span className="admin-users-user-name">{name}</span>

                          <span className="admin-users-user-label">
                            Registered User
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-users-email">
                        <i className="fa-regular fa-envelope"></i>
                        {email}
                      </span>
                    </td>

                    <td>
                      <span className="admin-users-date">
                        <i className="fa-regular fa-calendar"></i>
                        {FormatDate(createdAt)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-users-playlist-btn"
                        onClick={() => OpenUserPlaylists(user)}
                        disabled={
                          userId === null ||
                          userId === undefined ||
                          userId === ""
                        }
                      >
                        <i className="fa-solid fa-list"></i>
                        View Playlists
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-users-delete-btn"
                        onClick={() => DeleteUser(user)}
                        title="Delete user"
                        aria-label={`Delete ${name}`}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
