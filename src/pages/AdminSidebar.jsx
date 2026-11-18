import React from "react";
import "../styles/AdminSidebar.css";
import { Link, useNavigate } from "react-router-dom";
import cookie from "js-cookie";

function AdminSidebar() {
  const navigate = useNavigate();

  const HandleLogout = () => {
    cookie.remove("admintoken", { path: "/" });
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img
          src="https://res.cloudinary.com/yetzgheo/image/upload/v1790759048/spotify_sfn1lo.png"
          alt="Spotify Logo"
        />
        <h2>Spotify Admin</h2>
      </div>

      <div className="admin-sidebar-menu">
        <Link to="/adminhome/admindashboard" className="admin-sidebar-item">
          <i className="fa-solid fa-house"></i>
          <span>Dashboard</span>
        </Link>

        <Link to="/adminhome/adminsongs" className="admin-sidebar-item">
          <i className="fa-solid fa-music"></i>
          <span>Songs</span>
        </Link>

        <Link to="/adminhome/adminartists" className="admin-sidebar-item">
          <i className="fa-solid fa-user"></i>
          <span>Artists</span>
        </Link>

        <Link to="/adminhome/admincategories" className="admin-sidebar-item">
          <i className="fa-solid fa-layer-group"></i>
          <span>Browse Category</span>
        </Link>

        <Link to="/adminhome/adminads" className="admin-sidebar-item">
          <i className="fa-solid fa-rectangle-ad"></i>
          <span>Ads</span>
        </Link>

        <Link to="/adminhome/adminusers" className="admin-sidebar-item">
          <i className="fa-solid fa-users"></i>
          <span>Users</span>
        </Link>
      </div>

      <div className="admin-sidebar-bottom">
        <Link to="/adminhome/adminprofile" className="admin-sidebar-item">
          <i className="fa-solid fa-user-gear"></i>
          <span>Profile</span>
        </Link>

        <button
          type="button"
          className="admin-sidebar-item logout"
          onClick={HandleLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
