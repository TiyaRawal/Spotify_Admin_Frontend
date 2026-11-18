import React, { useEffect, useState } from "react";
import "../styles/AdminAds.css";
import api from "../../utils/AxiosConfig";

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    active: true,
  });

  useEffect(() => {
    GetAds();
  }, []);

  const GetAds = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/adminads");
      const adList = response.data.ads ?? response.data.data ?? [];

      setAds(Array.isArray(adList) ? adList : []);
    } catch (e) {
      console.log(e);
      setError("Unable to load ads. Please check your backend route.");
    } finally {
      setLoading(false);
    }
  };

  const HandleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const OpenAddForm = () => {
    setEditingAd(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      active: true,
    });
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const OpenEditForm = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || "",
      description: ad.description || "",
      image: ad.image || "",
      active: ad.active ?? true,
    });
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const CloseForm = () => {
    setShowForm(false);
    setEditingAd(null);
    setError("");
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Ad title is required.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (editingAd) {
        response = await api.put("/adminads", {
          ad_id: editingAd._id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.image.trim(),
          active: formData.active,
        });
      } else {
        response = await api.post("/adminads", {
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.image.trim(),
          active: formData.active,
        });
      }

      if (response.data.success) {
        setMessage(
          editingAd ? "Ad updated successfully." : "Ad added successfully.",
        );
        CloseForm();
        await GetAds();
      } else {
        setError(response.data.message || "Unable to save ad.");
      }
    } catch (e) {
      console.log(e);
      setError(
        e.response?.data?.message ||
          "Unable to save ad. Please check your backend API.",
      );
    } finally {
      setSaving(false);
    }
  };

  const ToggleAdStatus = async (ad) => {
    try {
      setError("");
      setMessage("");

      const response = await api.put("/adminads", {
        ad_id: ad._id,
        title: ad.title || "",
        description: ad.description || "",
        image: ad.image || "",
        active: !ad.active,
      });

      if (response.data.success) {
        setAds((previous) =>
          previous.map((item) =>
            item._id === ad._id ? { ...item, active: !ad.active } : item,
          ),
        );

        setMessage(
          `Ad ${!ad.active ? "activated" : "deactivated"} successfully.`,
        );
      } else {
        setError(response.data.message || "Unable to update ad status.");
      }
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Unable to update ad status.");
    }
  };

  const DeleteAd = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await api.delete(`/adminads/${adId}`);

      if (response.data.success) {
        setAds((previous) => previous.filter((ad) => ad._id !== adId));
        setMessage("Ad deleted successfully.");
      } else {
        setError(response.data.message || "Unable to delete ad.");
      }
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Unable to delete ad.");
    }
  };

  return (
    <div className="admin-ads">
      <div className="admin-ads-header">
        <div>
          <p className="admin-ads-eyebrow">ADVERTISEMENT MANAGEMENT</p>
          <h1>Ads</h1>
          <p className="admin-ads-subtitle">
            Manage advertisements and their active status.
          </p>
        </div>

        <button
          type="button"
          className="admin-ads-add-btn"
          onClick={OpenAddForm}
        >
          <i className="fa-solid fa-plus"></i>
          Add Ad
        </button>
      </div>

      {message && <p className="admin-ads-message">{message}</p>}

      {error && <p className="admin-ads-error">{error}</p>}

      {showForm && (
        <div className="admin-ads-form-card">
          <div className="admin-ads-form-header">
            <div>
              <h2>{editingAd ? "Edit Ad" : "Add New Ad"}</h2>
              <p>Enter the advertisement details below.</p>
            </div>

            <button
              type="button"
              className="admin-ads-close-btn"
              onClick={CloseForm}
              aria-label="Close form"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form onSubmit={HandleSubmit}>
            <div className="admin-ads-field">
              <label htmlFor="ad-title">Ad Title *</label>
              <input
                id="ad-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={HandleChange}
                placeholder="Enter ad title"
                required
              />
            </div>

            <div className="admin-ads-field">
              <label htmlFor="ad-description">Description</label>
              <textarea
                id="ad-description"
                name="description"
                value={formData.description}
                onChange={HandleChange}
                placeholder="Enter ad description"
                rows="3"
              />
            </div>

            <div className="admin-ads-field">
              <label htmlFor="ad-image">Image URL</label>
              <input
                id="ad-image"
                type="url"
                name="image"
                value={formData.image}
                onChange={HandleChange}
                placeholder="https://example.com/ad-image.jpg"
              />
            </div>

            {formData.image && (
              <img
                className="admin-ads-preview"
                src={formData.image}
                alt="Ad preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            )}

            <label className="admin-ads-checkbox">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={HandleChange}
              />
              <span>Ad is active</span>
            </label>

            <div className="admin-ads-form-actions">
              <button
                type="button"
                className="admin-ads-cancel-btn"
                onClick={CloseForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-ads-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : editingAd ? "Save Changes" : "Add Ad"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-ads-summary">
        <div className="admin-ads-summary-card">
          <span>Total Ads</span>
          <strong>{ads.length}</strong>
        </div>

        <div className="admin-ads-summary-card">
          <span>Active Ads</span>
          <strong>{ads.filter((ad) => ad.active === true).length}</strong>
        </div>

        <div className="admin-ads-summary-card">
          <span>Inactive Ads</span>
          <strong>{ads.filter((ad) => ad.active !== true).length}</strong>
        </div>
      </div>

      <div className="admin-ads-list-header">
        <h2>All Advertisements</h2>
        <span>{ads.length} ads</span>
      </div>

      {loading ? (
        <div className="admin-ads-status">Loading ads...</div>
      ) : ads.length === 0 ? (
        <div className="admin-ads-status">
          <i className="fa-solid fa-rectangle-ad"></i>
          <h3>No advertisements yet</h3>
          <p>Add your first advertisement to get started.</p>
          <button
            type="button"
            className="admin-ads-add-btn"
            onClick={OpenAddForm}
          >
            <i className="fa-solid fa-plus"></i>
            Add Ad
          </button>
        </div>
      ) : (
        <div className="admin-ads-list">
          {ads.map((ad) => (
            <div className="admin-ad-card" key={ad._id}>
              <div className="admin-ad-image-wrap">
                {ad.image ? (
                  <img
                    className="admin-ad-image"
                    src={ad.image}
                    alt={ad.title || "Advertisement"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="admin-ad-image-placeholder">
                    <i className="fa-solid fa-rectangle-ad"></i>
                  </div>
                )}
              </div>

              <div className="admin-ad-details">
                <div className="admin-ad-title-row">
                  <h3>{ad.title || "Untitled Ad"}</h3>

                  <span
                    className={`admin-ad-status ${
                      ad.active ? "is-active" : "is-inactive"
                    }`}
                  >
                    {ad.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="admin-ad-description">
                  {ad.description || "No description provided."}
                </p>

                <div className="admin-ad-actions">
                  <button
                    type="button"
                    className="admin-ad-status-btn"
                    onClick={() => ToggleAdStatus(ad)}
                  >
                    <i
                      className={`fa-solid ${
                        ad.active ? "fa-toggle-on" : "fa-toggle-off"
                      }`}
                    ></i>
                    {ad.active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    className="admin-ad-edit-btn"
                    onClick={() => OpenEditForm(ad)}
                  >
                    <i className="fa-solid fa-pen"></i>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-ad-delete-btn"
                    onClick={() => DeleteAd(ad._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAds;
