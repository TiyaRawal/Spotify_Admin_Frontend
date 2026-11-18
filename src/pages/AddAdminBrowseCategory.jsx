import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddAdminBrowseCategory.css";
import api from "../../utils/AxiosConfig";

function AddAdminBrowseCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    color: "#1DB954",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.image.trim()) {
      setError("Please enter the category title and image URL.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post("/adminbrowsecategory", {
        title: formData.title.trim(),
        image: formData.image.trim(),
        color: formData.color,
      });

      if (response.data.success) {
        navigate("/adminhome/admincategories", {
          state: { message: "Category added successfully." },
        });
      } else {
        setError(response.data.message || "Unable to add category.");
      }
    } catch (e) {
      console.log("Add Category Error:", e);
      setError(e.response?.data?.message || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-admin-browse-category">
      <div className="add-admin-browse-category-header">
        <div>
          <p className="add-admin-browse-category-eyebrow">
            CONTENT MANAGEMENT
          </p>

          <h1>Add Browse Category</h1>

          <p className="add-admin-browse-category-subtitle">
            Add a new category to Browse All.
          </p>
        </div>

        <button
          type="button"
          className="add-admin-browse-category-back-btn"
          onClick={() => navigate("/adminhome/admincategories")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Categories
        </button>
      </div>

      {error && <p className="add-admin-browse-category-error">{error}</p>}

      <div className="add-admin-browse-category-form-card">
        <div className="add-admin-browse-category-form-header">
          <div>
            <h2>Category Details</h2>
            <p>Enter the details for your new category.</p>
          </div>
        </div>

        <form onSubmit={HandleSubmit}>
          <div className="add-admin-browse-category-field">
            <label htmlFor="new-category-title">Category Title *</label>

            <input
              id="new-category-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={HandleChange}
              placeholder="e.g. Pop, Hip-Hop, Rock"
              required
            />
          </div>

          <div className="add-admin-browse-category-field">
            <label htmlFor="new-category-image">Image URL *</label>

            <input
              id="new-category-image"
              type="url"
              name="image"
              value={formData.image}
              onChange={HandleChange}
              placeholder="https://example.com/category.jpg"
              required
            />
          </div>

          {formData.image && (
            <div className="add-admin-browse-category-preview-wrap">
              <p>Image Preview</p>

              <img
                className="add-admin-browse-category-preview"
                src={formData.image}
                alt="Category preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            </div>
          )}

          <div className="add-admin-browse-category-field">
            <label htmlFor="new-category-color">Category Color</label>

            <div className="add-admin-browse-category-color-input">
              <input
                id="new-category-color"
                type="color"
                name="color"
                value={formData.color}
                onChange={HandleChange}
              />

              <span>{formData.color.toUpperCase()}</span>
            </div>
          </div>

          <div className="add-admin-browse-category-form-actions">
            <button
              type="button"
              className="add-admin-browse-category-cancel-btn"
              onClick={() => navigate("/adminhome/admincategories")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-admin-browse-category-save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Adding...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i>
                  Add Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdminBrowseCategory;