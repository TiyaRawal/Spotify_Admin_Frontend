import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/EditAdminArtists.css";
import api from "../../utils/AxiosConfig";

const EditAdminArtists = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedPopularSong, setSelectedPopularSong] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    coverImage: "",
    category: "",
    followers: "",
    artistPick: "",
    popularSongs: [],
  });

  const GetSongId = (song) => {
    if (song === null || song === undefined || song === "") {
      return "";
    }

    if (typeof song !== "object") {
      return String(song);
    }

    return String(song.songId ?? song.song_id ?? song.id ?? song._id ?? "");
  };

  const GetSongTitle = (songId) => {
    const song = songs.find((item) => GetSongId(item) === String(songId));

    return song?.title || song?.name || "Song not found";
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [artistResponse, songsResponse] = await Promise.all([
          api.get("/adminartists"),
          api.get("/adminsongs"),
        ]);

        const artistList = artistResponse.data.artists || [];
        const artist =
          artistList.find((item) => item._id === id) ||
          (location.state?.artist?._id === id ? location.state.artist : null);

        const songList =
          songsResponse.data.songs ??
          songsResponse.data.data ??
          songsResponse.data.allSongs ??
          [];

        setSongs(Array.isArray(songList) ? songList : []);

        if (!artist) {
          setError("Artist not found.");
          return;
        }

        setFormData({
          name: artist.name || "",
          image: artist.image || "",
          coverImage: artist.coverImage || "",
          category: artist.category || "",
          followers: artist.followers || "",
          artistPick: GetSongId(artist.artistPick),
          popularSongs: Array.isArray(artist.popularSongs)
            ? artist.popularSongs.map(GetSongId).filter(Boolean)
            : [],
        });
      } catch (e) {
        console.log(e);
        setError("Unable to load artist details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    LoadData();
  }, [id]);

  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const AddPopularSong = () => {
    if (!selectedPopularSong) {
      setError("Please select a song.");
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

      const response = await api.put("/adminartists", {
        artist_id: id,
        name: formData.name.trim(),
        image: formData.image.trim(),
        coverImage: formData.coverImage.trim(),
        category: formData.category.trim(),
        followers: formData.followers.trim(),
        artistPick: formData.artistPick,
        popularSongs: formData.popularSongs,
      });

      if (response.data.success) {
        navigate("/adminhome/adminartists");
      } else {
        setError(response.data.message || "Unable to update artist.");
      }
    } catch (e) {
      console.log(e);
      setError(
        e.response?.data?.message ||
          "Unable to update artist. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-admin-artist">
        <div className="edit-admin-artist-status">
          Loading artist details...
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="edit-admin-artist">
        <div className="edit-admin-artist-status edit-admin-artist-error">
          {error}
          <button
            type="button"
            onClick={() => navigate("/adminhome/adminartists")}
          >
            Back to Artists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-admin-artist">
      <div className="edit-admin-artist-header">
        <div>
          <h1>Edit Artist</h1>
          <p>Update artist information and music details.</p>
        </div>

        <button
          type="button"
          className="edit-admin-artist-back"
          onClick={() => navigate("/adminhome/adminartists")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Artists
        </button>
      </div>

      <form className="edit-admin-artist-form" onSubmit={HandleSubmit}>
        <div className="edit-admin-artist-section">
          <h2>Artist Information</h2>

          <div className="edit-admin-artist-field">
            <label htmlFor="edit-artist-name">Artist Name *</label>
            <input
              id="edit-artist-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={HandleChange}
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="edit-admin-artist-field">
            <label htmlFor="edit-artist-image">Artist Image URL *</label>
            <input
              id="edit-artist-image"
              type="url"
              name="image"
              value={formData.image}
              onChange={HandleChange}
              placeholder="Enter artist image URL"
              required
            />

            {formData.image && (
              <img
                className="edit-admin-artist-preview"
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

          <div className="edit-admin-artist-field">
            <label htmlFor="edit-artist-cover">Cover Image URL</label>
            <input
              id="edit-artist-cover"
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={HandleChange}
              placeholder="Enter cover image URL"
            />
          </div>

          <div className="edit-admin-artist-row">
            <div className="edit-admin-artist-field">
              <label htmlFor="edit-artist-category">Category</label>
              <input
                id="edit-artist-category"
                type="text"
                name="category"
                value={formData.category}
                onChange={HandleChange}
                placeholder="e.g. Popular Artists"
              />
            </div>

            <div className="edit-admin-artist-field">
              <label htmlFor="edit-artist-followers">Monthly Listeners</label>
              <input
                id="edit-artist-followers"
                type="text"
                name="followers"
                value={formData.followers}
                onChange={HandleChange}
                placeholder="e.g. 43,112,507 monthly listeners"
              />
            </div>
          </div>
        </div>

        <div className="edit-admin-artist-section">
          <h2>Artist Pick</h2>

          <div className="edit-admin-artist-field">
            <label htmlFor="edit-artist-pick">Select Artist Pick Song</label>
            <select
              id="edit-artist-pick"
              name="artistPick"
              value={formData.artistPick}
              onChange={HandleChange}
            >
              <option value="">Select a song</option>

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

        <div className="edit-admin-artist-section">
          <h2>Popular Songs</h2>
          <p className="edit-admin-artist-help">
            Add or remove songs from this artist's popular songs.
          </p>

          <div className="edit-admin-artist-song-selector">
            <select
              value={selectedPopularSong}
              onChange={(e) => setSelectedPopularSong(e.target.value)}
            >
              <option value="">Select a song</option>

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
              className="edit-admin-artist-add-song"
              onClick={AddPopularSong}
              disabled={!selectedPopularSong}
            >
              <i className="fa-solid fa-plus"></i>
              Add Song
            </button>
          </div>

          {formData.popularSongs.length > 0 ? (
            <div className="edit-admin-artist-selected-songs">
              {formData.popularSongs.map((songId, index) => (
                <div
                  className="edit-admin-artist-selected-song"
                  key={`${songId}-${index}`}
                >
                  <span>
                    <i className="fa-solid fa-music"></i>
                    {GetSongTitle(songId)}
                  </span>

                  <button
                    type="button"
                    onClick={() => RemovePopularSong(songId)}
                    title="Remove song"
                    aria-label={`Remove ${GetSongTitle(songId)}`}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="edit-admin-artist-empty-songs">
              No popular songs selected.
            </p>
          )}
        </div>

        {error && <p className="edit-admin-artist-error">{error}</p>}

        <div className="edit-admin-artist-actions">
          <button
            type="button"
            className="edit-admin-artist-cancel"
            onClick={() => navigate("/adminhome/adminartists")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-admin-artist-submit"
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminArtists;