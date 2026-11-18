import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddAdminSong.css";
import api from "../../utils/AxiosConfig";

function AddAdminSongs() {
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

  let HandleInputChange = (e) => {
    setSong((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function HandleSubmit(e) {
    e.preventDefault();

    try {
      let response = await api.post("/adminsongs", {
        ...song,
        year: Number(song.year),
        songsCount: Number(song.songsCount),
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/adminhome/adminsongs");
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to add song");
    }
  }

  return (
    <div className="admin-add-song">
      <div className="admin-add-song-header">
        <div>
          <p className="admin-add-song-eyebrow">MUSIC LIBRARY</p>
          <h1>Add Song</h1>
          <p className="admin-add-song-subtitle">
            Add a new track to your Spotify music library.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-song-back"
          onClick={() => navigate("/adminhome/adminsongs")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Songs
        </button>
      </div>

      <div className="admin-add-song-card">
        <div className="admin-add-song-card-header">
          <div className="admin-add-song-icon">
            <i className="fa-solid fa-music"></i>
          </div>

          <div>
            <h2>Song Details</h2>
            <p>Enter the information for your new track.</p>
          </div>
        </div>

        <div className="admin-add-song-card-body">
          <form onSubmit={HandleSubmit}>
            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
              <label>Audio URL</label>
              <input
                type="url"
                name="audio"
                value={song.audio}
                onChange={HandleInputChange}
                placeholder="https://example.com/audio.mp3"
              />
            </div>

            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={song.duration}
                onChange={HandleInputChange}
                placeholder="e.g. 3:45"
              />
            </div>

            <div className="admin-add-song-field">
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

            <div className="admin-add-song-field">
              <label>
                Category <span>*</span>
              </label>
              <input
                type="text"
                name="category"
                value={song.category}
                onChange={HandleInputChange}
                placeholder="Enter song category"
                required
              />
            </div>

            <div className="admin-add-song-field">
              <label>Songs Count</label>
              <input
                type="number"
                name="songsCount"
                min="1"
                value={song.songsCount}
                onChange={HandleInputChange}
              />
            </div>

            <div className="admin-add-song-field">
              <label>Album Duration</label>
              <input
                type="text"
                name="albumDuration"
                value={song.albumDuration}
                onChange={HandleInputChange}
                placeholder="e.g. 8 min 23 sec"
              />
            </div>

            <div className="admin-add-song-field admin-add-song-description">
              <label>Description</label>
              <textarea
                name="description"
                value={song.description}
                onChange={HandleInputChange}
                placeholder="Write a short description about the song"
                rows="3"
              />
            </div>

            <div className="admin-add-song-actions">
              <button type="submit" className="admin-add-song-submit">
                <i className="fa-solid fa-plus"></i>
                Add Song
              </button>

              <button
                type="button"
                className="admin-add-song-cancel"
                onClick={() => navigate("/adminhome/adminsongs")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAdminSongs;