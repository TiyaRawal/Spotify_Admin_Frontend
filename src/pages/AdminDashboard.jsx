import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import api from "../../utils/AxiosConfig";

function AdminDashboard() {
  let [dashboardData, setDashboardData] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalUsers: 0,
    totalPlaylists: 0,
    totalCategories: 0,
    totalAds: 0,
    recentSongs: [],
  });

  let GetDashboardData = async () => {
    try {
      let response = await api.get("/dashboard");
      setDashboardData(response.data);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to fetch dashboard data!");
    }
  };

  useEffect(() => {
    GetDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>

        <div className="admin-dashboard-profile">
          <i className="fa-solid fa-circle-user"></i>
          <span>Admin</span>
        </div>
      </div>

      <div className="admin-dashboard-stats">
        <div className="admin-dashboard-card">
          <div>
            <p>Total Songs</p>
            <h2>{dashboardData.totalSongs}</h2>
          </div>
          <i className="fa-solid fa-music"></i>
        </div>

        <div className="admin-dashboard-card">
          <div>
            <p>Total Artists</p>
            <h2>{dashboardData.totalArtists}</h2>
          </div>
          <i className="fa-solid fa-user"></i>
        </div>

        <div className="admin-dashboard-card">
          <div>
            <p>Total Users</p>
            <h2>{dashboardData.totalUsers}</h2>
          </div>
          <i className="fa-solid fa-users"></i>
        </div>

        <div className="admin-dashboard-card">
          <div>
            <p>Total Playlists</p>
            <h2>{dashboardData.totalPlaylists}</h2>
          </div>
          <i className="fa-solid fa-list"></i>
        </div>
      </div>

      <div className="admin-dashboard-stats">
        <div className="admin-dashboard-card">
          <div>
            <p>Browse Categories</p>
            <h2>{dashboardData.totalCategories}</h2>
          </div>
          <i className="fa-solid fa-layer-group"></i>
        </div>

        <div className="admin-dashboard-card">
          <div>
            <p>Total Ads</p>
            <h2>{dashboardData.totalAds}</h2>
          </div>
          <i className="fa-solid fa-rectangle-ad"></i>
        </div>
      </div>

      <div className="admin-dashboard-section">
        <div className="admin-dashboard-section-header">
          <h2>Recent Songs</h2>
        </div>

        <div className="admin-dashboard-recent-songs">
          {dashboardData.recentSongs.map((song) => (
            <div className="admin-dashboard-song">
              <img src={song.image} alt={song.title} />
              <div>
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
              <span>{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
