import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/EditAdminSong.css";
import api from "../../utils/AxiosConfig";

function EditAdminSong({ id }) {
  let location = useLocation();
  let navigate = useNavigate();

  let [song, setSong] = useState({
    title: "",
    artist: "",
    image: "",
    category: "Trending Songs",
    type: "",
    album: "",
    year: "",
    duration: "",
    songsCount: "1",
    albumDuration: "",
    audio: "",
    description: "",
  });

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");

  useEffect(() => {
    async function LoadSong() {
      try {
        let songData = location.state?.song;

        if (!songData) {
          let response = await api.get("/adminsongs");

          songData = (response.data.songs || []).find(
            (item) => item._id === id
          );
        }

        if (songData) {
          setSong({
            title: songData.title || "",
            artist: songData.artist || "",
            image: songData.image || "",
            category: songData.category || "Trending Songs",
            type: songData.type || "",
            album: songData.album || "",
            year: songData.year || "",
            duration: songData.duration || "",
            songsCount: songData.songsCount || 1,
            albumDuration: songData.albumDuration || "",
            audio: songData.audio || "",
            description: songData.description || "",
          });
        } else {
          setError("Song not found");
        }
      } catch (e) {
        setError(
          e.response?.data?.message || "Failed to load song details"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      LoadSong();
    } else {
      setError("Valid Song ID is required");
      setLoading(false);
    }
  }, [id]);

  let HandleInputChange = (e) => {
    setSong((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function HandleSubmit(e) {
    e.preventDefault();

    if (!id) {
      alert("Valid Song ID is required");
      return;
    }

    try {
      let response = await api.put(`/adminsongs/${id}`, {
        ...song,
        year: Number(song.year),
        songsCount: Number(song.songsCount),
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/adminhome/adminsongs");
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update song");
    }
  }

  return (
    <div className="admin-edit-song">
      <div className="admin-edit-song-header">
        <div>
          <p className="admin-edit-song-eyebrow">MUSIC LIBRARY</p>
          <h1>Edit Song</h1>
          <p className="admin-edit-song-subtitle">
            Update the details of your existing track.
          </p>
        </div>

        <button
          type="button"
          className="admin-edit-song-back"
          onClick={() => navigate("/adminhome/adminsongs")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Songs
        </button>
      </div>

      {loading ? (
        <div className="admin-edit-song-status">
          Loading song details...
        </div>
      ) : error ? (
        <div className="admin-edit-song-status admin-edit-song-error">
          {error}
        </div>
      ) : (
        <div className="admin-edit-song-card">
          <div className="admin-edit-song-card-header">
            <div className="admin-edit-song-icon">
              <i className="fa-solid fa-music"></i>
            </div>

            <div>
              <h2>Song Details</h2>
              <p>Update the information for this track.</p>
            </div>
          </div>

          <div className="admin-edit-song-card-body">
            <form onSubmit={HandleSubmit}>
              <div className="admin-edit-song-field">
                <label>
                  Song Title <span>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={song.title}
                  onChange={HandleInputChange}
                  placeholder="Enter song title"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Artist <span>*</span>
                </label>
                <input
                  type="text"
                  name="artist"
                  value={song.artist}
                  onChange={HandleInputChange}
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Image URL <span>*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={song.image}
                  onChange={HandleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>Audio URL</label>
                <input
                  type="url"
                  name="audio"
                  value={song.audio}
                  onChange={HandleInputChange}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Album <span>*</span>
                </label>
                <input
                  type="text"
                  name="album"
                  value={song.album}
                  onChange={HandleInputChange}
                  placeholder="Enter album name"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Release Year <span>*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={song.year}
                  onChange={HandleInputChange}
                  placeholder="e.g. 2026"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={song.duration}
                  onChange={HandleInputChange}
                  placeholder="e.g. 3:45"
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Type <span>*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  value={song.type}
                  onChange={HandleInputChange}
                  placeholder="e.g. Single"
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>
                  Category <span>*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={song.category}
                  onChange={HandleInputChange}
                  required
                />
              </div>

              <div className="admin-edit-song-field">
                <label>Songs Count</label>
                <input
                  type="number"
                  name="songsCount"
                  min="1"
                  value={song.songsCount}
                  onChange={HandleInputChange}
                />
              </div>

              <div className="admin-edit-song-field">
                <label>Album Duration</label>
                <input
                  type="text"
                  name="albumDuration"
                  value={song.albumDuration}
                  onChange={HandleInputChange}
                  placeholder="e.g. 8 min 23 sec"
                />
              </div>

              <div className="admin-edit-song-field admin-edit-song-description">
                <label>Description</label>
                <textarea
                  name="description"
                  value={song.description}
                  onChange={HandleInputChange}
                  placeholder="Write a short description about the song"
                  rows="3"
                />
              </div>

              <div className="admin-edit-song-actions">
                <button
                  type="submit"
                  className="admin-edit-song-submit"
                >
                  <i className="fa-solid fa-check"></i>
                  Save Changes
                </button>

                <button
                  type="button"
                  className="admin-edit-song-cancel"
                  onClick={() => navigate("/adminhome/adminsongs")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditAdminSong;
