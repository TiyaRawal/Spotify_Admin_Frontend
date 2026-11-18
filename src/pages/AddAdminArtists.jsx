import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddAdminArtists.css";
import api from "../../utils/AxiosConfig";

const AddAdminArtists = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    coverImage: "",
    category: "",
    followers: "",
    artistPick: "",
    popularSongs: [],
  });
  const [selectedPopularSong, setSelectedPopularSong] = useState("");

  useEffect(() => {
    GetSongs();
  }, []);

  const GetSongs = async () => {
    try {
      const response = await api.get("/adminsongs");
      const songList = response.data.songs ?? [];

      setSongs(Array.isArray(songList) ? songList : []);
    } catch (e) {
      console.log("Error fetching songs:", e);
      setError("Unable to load songs.");
    } finally {
      setLoadingSongs(false);
    }
  };

  const GetSongId = (song) => {
    if (!song || typeof song !== "object") {
      return String(song ?? "");
    }

    return String(song.songId ?? song.song_id ?? song.id ?? song._id ?? "");
  };

  const GetSongTitle = (songId) => {
    const song = songs.find((item) => GetSongId(item) === String(songId));

    return song?.title || song?.name || "Untitled Song";
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const AddPopularSong = () => {
    if (!selectedPopularSong) {
      setError("Please select a song to add.");
      return;
    }

    if (formData.popularSongs.includes(selectedPopularSong)) {
      setError("This song is already selected.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      popularSongs: [...previous.popularSongs, selectedPopularSong],
    }));

    setSelectedPopularSong("");
    setError("");
  };

  const RemovePopularSong = (songId) => {
    setFormData((previous) => ({
      ...previous,
      popularSongs: previous.popularSongs.filter((id) => id !== songId),
    }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Artist name is required.");
      return;
    }

    if (!formData.image.trim()) {
      setError("Artist image URL is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        image: formData.image.trim(),
        coverImage: formData.coverImage.trim(),
        category: formData.category.trim(),
        followers: formData.followers.trim(),
        artistPick: formData.artistPick,
        popularSongs: formData.popularSongs,
      };

      const response = await api.post("/adminartists", payload);

      if (response.data.success) {
        navigate("/adminhome/adminartists");
      } else {
        setError(response.data.message || "Unable to add artist.");
      }
    } catch (e) {
      console.log("Error adding artist:", e);

      setError(
        e.response?.data?.message ||
          "Unable to add artist. Please check your details and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-admin-artist">
      <div className="add-admin-artist-header">
        <div>
          <h1>Add Artist</h1>
          <p>Add an artist and manage their music details.</p>
        </div>

        <button
          type="button"
          className="add-admin-artist-back"
          onClick={() => navigate("/adminhome/adminartists")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Artists
        </button>
      </div>

      <form className="add-admin-artist-form" onSubmit={HandleSubmit}>
        <div className="add-admin-artist-section">
          <h2>Artist Information</h2>

          <div className="add-admin-artist-field">
            <label htmlFor="artist-name">Artist Name *</label>
            <input
              id="artist-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={HandleChange}
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="add-admin-artist-field">
            <label htmlFor="artist-image">Artist Image URL *</label>
            <input
              id="artist-image"
              type="url"
              name="image"
              value={formData.image}
              onChange={HandleChange}
              placeholder="https://example.com/artist-image.jpg"
              required
            />
            {formData.image && (
              <img
                className="add-admin-artist-preview"
                src={formData.image}
                alt="Artist preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = "block";
                }}
              />
            )}
          </div>

          <div className="add-admin-artist-field">
            <label htmlFor="artist-cover">Cover Image URL</label>
            <input
              id="artist-cover"
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={HandleChange}
              placeholder="https://example.com/artist-cover.jpg"
            />
          </div>

          <div className="add-admin-artist-row">
            <div className="add-admin-artist-field">
              <label htmlFor="artist-category">Category</label>
              <input
                id="artist-category"
                type="text"
                name="category"
                value={formData.category}
                onChange={HandleChange}
                placeholder="e.g. Popular Artists"
              />
            </div>

            <div className="add-admin-artist-field">
              <label htmlFor="artist-followers">Monthly Listeners</label>
              <input
                id="artist-followers"
                type="text"
                name="followers"
                value={formData.followers}
                onChange={HandleChange}
                placeholder="e.g. 43,112,507 monthly listeners"
              />
            </div>
          </div>
        </div>

        <div className="add-admin-artist-section">
          <h2>Artist Pick</h2>

          <div className="add-admin-artist-field">
            <label htmlFor="artist-pick">Select Artist Pick Song</label>
            <select
              id="artist-pick"
              name="artistPick"
              value={formData.artistPick}
              onChange={HandleChange}
              disabled={loadingSongs}
            >
              <option value="">
                {loadingSongs ? "Loading songs..." : "Select a song"}
              </option>

              {songs.map((song) => {
                const songId = GetSongId(song);

                return (
                  <option key={song._id || songId} value={songId}>
                    {song.title || song.name || "Untitled Song"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="add-admin-artist-section">
          <h2>Popular Songs</h2>
          <p className="add-admin-artist-help">
            Select existing songs to add to this artist's popular songs.
          </p>

          <div className="add-admin-artist-song-selector">
            <select
              value={selectedPopularSong}
              onChange={(e) => setSelectedPopularSong(e.target.value)}
              disabled={loadingSongs || songs.length === 0}
            >
              <option value="">
                {loadingSongs
                  ? "Loading songs..."
                  : songs.length === 0
                    ? "No songs available"
                    : "Select a song"}
              </option>

              {songs
                .filter(
                  (song) => !formData.popularSongs.includes(GetSongId(song)),
                )
                .map((song) => {
                  const songId = GetSongId(song);

                  return (
                    <option key={song._id || songId} value={songId}>
                      {song.title || song.name || "Untitled Song"}
                    </option>
                  );
                })}
            </select>

            <button
              type="button"
              className="add-admin-artist-add-song"
              onClick={AddPopularSong}
              disabled={!selectedPopularSong || loadingSongs}
            >
              <i className="fa-solid fa-plus"></i>
              Add Song
            </button>
          </div>

          {formData.popularSongs.length > 0 ? (
            <div className="add-admin-artist-selected-songs">
              {formData.popularSongs.map((songId, index) => (
                <div
                  className="add-admin-artist-selected-song"
                  key={`${songId}-${index}`}
                >
                  <span>
                    <i className="fa-solid fa-music"></i>
                    {GetSongTitle(songId)}
                  </span>

                  <button
                    type="button"
                    onClick={() => RemovePopularSong(songId)}
                    aria-label={`Remove ${GetSongTitle(songId)}`}
                    title="Remove song"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="add-admin-artist-empty-songs">
              No popular songs selected yet.
            </p>
          )}
        </div>

        {error && <p className="add-admin-artist-error">{error}</p>}

        <div className="add-admin-artist-actions">
          <button
            type="button"
            className="add-admin-artist-cancel"
            onClick={() => navigate("/adminhome/adminartists")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-admin-artist-submit"
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <i className="fa-solid fa-plus"></i>
                Add Artist
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminArtists;