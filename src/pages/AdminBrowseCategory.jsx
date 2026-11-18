import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminBrowseCategory.css";
import api from "../../utils/AxiosConfig";

function AdminBrowseCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/adminbrowsecategory");
      const categoryList = response.data.categories ?? [];

      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch (e) {
      console.log("Get Categories Error:", e);
      setError(
        e.response?.data?.message ||
          "Unable to load categories. Please check your backend API.",
      );
    } finally {
      setLoading(false);
    }
  };

  const DeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await api.delete(`/adminbrowsecategory/${categoryId}`);

      if (response.data.success) {
        setCategories((previous) =>
          previous.filter((category) => category._id !== categoryId),
        );
        setMessage("Category deleted successfully.");
      } else {
        setError(response.data.message || "Unable to delete category.");
      }
    } catch (e) {
      console.log("Delete Category Error:", e);
      setError(e.response?.data?.message || "Unable to delete category.");
    }
  };

  const OpenAddPage = () => {
    navigate("/adminhome/admincategories/add");
  };

  const OpenEditPage = (category) => {
    navigate(`/adminhome/admincategories/edit/${category._id}`);
  };

  return (
    <div className="admin-browse-category">
      <div className="admin-browse-category-header">
        <div>
          <p className="admin-browse-category-eyebrow">CONTENT MANAGEMENT</p>

          <h1>Browse Categories</h1>

          <p className="admin-browse-category-subtitle">
            Manage the categories displayed in Browse All.
          </p>
        </div>

        <button
          type="button"
          className="admin-browse-category-add-btn"
          onClick={OpenAddPage}
        >
          <i className="fa-solid fa-plus"></i>
          Add Category
        </button>
      </div>

      {message && <p className="admin-browse-category-message">{message}</p>}

      {error && <p className="admin-browse-category-error">{error}</p>}

      <div className="admin-browse-category-list-header">
        <h2>All Categories</h2>
        <span>{categories.length} categories</span>
      </div>

      {loading ? (
        <div className="admin-browse-category-status">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-browse-category-status">
          <i className="fa-solid fa-layer-group"></i>

          <h3>No categories found</h3>

          <p>Add your first browse category to get started.</p>

          <button
            type="button"
            className="admin-browse-category-add-btn"
            onClick={OpenAddPage}
          >
            <i className="fa-solid fa-plus"></i>
            Add Category
          </button>
        </div>
      ) : (
        <div className="admin-browse-category-list">
          {categories.map((category) => (
            <div className="admin-browse-category-card" key={category._id}>
              <div
                className="admin-browse-category-image-wrap"
                style={{
                  backgroundColor: category.color || "#242424",
                }}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title || "Category"}
                    className="admin-browse-category-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <i className="fa-solid fa-music"></i>
                )}
              </div>

              <div className="admin-browse-category-details">
                <h3>{category.title || "Untitled Category"}</h3>

                <div className="admin-browse-category-color">
                  <span
                    style={{
                      backgroundColor: category.color || "#242424",
                    }}
                  ></span>
                  {category.color || "No color set"}
                </div>
              </div>

              <div className="admin-browse-category-actions">
                <button
                  type="button"
                  className="admin-browse-category-edit-btn"
                  onClick={() => OpenEditPage(category)}
                  title="Edit category"
                  aria-label="Edit category"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                <button
                  type="button"
                  className="admin-browse-category-delete-btn"
                  onClick={() => DeleteCategory(category._id)}
                  title="Delete category"
                  aria-label="Delete category"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBrowseCategory;