import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminArtists.css";
import api from "../../utils/AxiosConfig";

const AdminArtists = () => {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedArtists, setExpandedArtists] = useState({});
  const [savingSongs, setSavingSongs] = useState({});
  const [artistMessages, setArtistMessages] = useState({});

  useEffect(() => {
    GetArtists();
    GetSongs();
  }, []);

  const GetArtists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/adminartists");

      if (response.data.success) {
        setArtists(response.data.artists || []);
      } else {
        setError(response.data.message || "Unable to load artists.");
      }
    } catch (e) {
      console.log(e);
      setError("Unable to load artists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetSongs = async () => {
    try {
      const response = await api.get("/adminsongs");

      const songList =
        response.data.songs ??
        response.data.data ??
        response.data.allSongs ??
        [];

      setSongs(Array.isArray(songList) ? songList : []);
    } catch (e) {
      console.log(e);
      setSongs([]);
    }
  };

  const GetSongIds = (song) => {
    if (song === null || song === undefined || song === "") {
      return [];
    }

    if (typeof song !== "object") {
      return [String(song)];
    }

    return [song._id, song.songId, song.song_id, song.id]
      .filter((id) => id !== null && id !== undefined && id !== "")
      .map(String);
  };

  const GetSongTitle = (songValue) => {
    if (!songValue) return "Not selected";

    const ids = GetSongIds(songValue);

    const matchedSong = songs.find((song) =>
      GetSongIds(song).some((id) => ids.includes(id)),
    );

    if (matchedSong) {
      return matchedSong.title || matchedSong.name || "Untitled Song";
    }

    if (typeof songValue === "object") {
      return songValue.title || songValue.name || "Song not found";
    }

    return "Song not found";
  };

  const GetPopularSongs = (artist) =>
    Array.isArray(artist.popularSongs) ? artist.popularSongs : [];

  const GetStoredSongId = (song) => {
    if (song === null || song === undefined) return "";

    if (typeof song !== "object") {
      return String(song);
    }

    return String(song.songId ?? song.song_id ?? song.id ?? song._id ?? "");
  };

  const TogglePopularSongs = (artistId) => {
    setExpandedArtists((previous) => ({
      ...previous,
      [artistId]: !previous[artistId],
    }));
  };

  const RemovePopularSong = async (artist, songToRemove) => {
    const artistId = artist._id;
    const idsToRemove = GetSongIds(songToRemove);

    const updatedSongIds = GetPopularSongs(artist)
      .filter(
        (song) => !GetSongIds(song).some((id) => idsToRemove.includes(id)),
      )
      .map(GetStoredSongId)
      .filter(Boolean);

    try {
      setSavingSongs((previous) => ({
        ...previous,
        [artistId]: true,
      }));

      setArtistMessages((previous) => ({
        ...previous,
        [artistId]: null,
      }));

      const response = await api.put("/adminartists", {
        artist_id: artistId,
        popularSongs: updatedSongIds,
      });

      if (response.data.success) {
        setArtists((previous) =>
          previous.map((item) =>
            item._id === artistId
              ? { ...item, popularSongs: updatedSongIds }
              : item,
          ),
        );

        setArtistMessages((previous) => ({
          ...previous,
          [artistId]: {
            message: "Popular song removed successfully.",
            type: "success",
          },
        }));
      } else {
        setArtistMessages((previous) => ({
          ...previous,
          [artistId]: {
            message: response.data.message || "Unable to remove song.",
            type: "error",
          },
        }));
      }
    } catch (e) {
      console.log(e);

      setArtistMessages((previous) => ({
        ...previous,
        [artistId]: {
          message:
            e.response?.data?.message ||
            "Unable to remove song. Please try again.",
          type: "error",
        },
      }));
    } finally {
      setSavingSongs((previous) => ({
        ...previous,
        [artistId]: false,
      }));
    }
  };

  const RemoveArtist = async (artistId) => {
    if (!window.confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      const response = await api.delete(`/adminartists/${artistId}`);

      if (response.data.success) {
        setArtists((previous) =>
          previous.filter((artist) => artist._id !== artistId),
        );
      } else {
        alert(response.data.message || "Unable to delete artist.");
      }
    } catch (e) {
      console.log(e);

      alert(
        e.response?.data?.message ||
          "Unable to delete artist. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-artists">
        <div className="admin-artists-status">Loading artists...</div>
      </div>
    );
  }

  return (
    <div className="admin-artists">
      <div className="admin-artists-header">
        <div>
          <h1>Artists</h1>
          <p>Manage your artists and their popular songs.</p>
        </div>

        <Link
          to="/adminhome/adminartists/add"
          className="admin-artists-add-btn"
        >
          <i className="fa-solid fa-plus"></i>
          Add Artist
        </Link>
      </div>

      {error ? (
        <div className="admin-artists-status admin-artists-error">
          {error}
          <button onClick={GetArtists}>Try Again</button>
        </div>
      ) : artists.length === 0 ? (
        <div className="admin-artists-status">
          No artists found. Add your first artist.
        </div>
      ) : (
        <div className="admin-artists-list">
          {artists.map((artist) => {
            const popularSongs = GetPopularSongs(artist);
            const isExpanded = Boolean(expandedArtists[artist._id]);
            const isSaving = Boolean(savingSongs[artist._id]);

            return (
              <div className="admin-artist-card" key={artist._id}>
                <img
                  className="admin-artist-image"
                  src={artist.image || artist.coverImage || ""}
                  alt={artist.name || "Artist"}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />

                <div className="admin-artist-details">
                  <h2>{artist.name || "Untitled Artist"}</h2>

                  <span className="admin-artist-category">
                    {artist.category || "Uncategorized"}
                  </span>

                  <div className="admin-artist-meta">
                    <p className="admin-artist-followers">
                      <i className="fa-solid fa-users"></i>
                      <span>{artist.followers || "0 monthly listeners"}</span>
                    </p>

                    <p className="admin-artist-pick">
                      <span className="admin-artist-label">Artist Pick</span>

                      <span className="admin-artist-value">
                        {GetSongTitle(artist.artistPick)}
                      </span>
                    </p>
                  </div>

                  <div className="admin-artist-popular">
                    <div className="admin-artist-popular-heading">
                      <span className="admin-artist-popular-label">
                        Popular Songs
                      </span>

                      <button
                        type="button"
                        className="admin-artist-popular-toggle"
                        onClick={() => TogglePopularSongs(artist._id)}
                        aria-expanded={isExpanded}
                        aria-label="Toggle popular songs"
                      >
                        <span>({popularSongs.length})</span>

                        <i
                          className={`fa-solid ${
                            isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                          }`}
                        ></i>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="admin-artist-popular-content">
                        {popularSongs.length === 0 ? (
                          <p className="admin-artist-no-songs">
                            No popular songs added yet.
                          </p>
                        ) : (
                          <div className="admin-artist-popular-list">
                            {popularSongs.map((song, index) => (
                              <div
                                className="admin-artist-popular-song"
                                key={`${GetSongIds(song)[0] || "song"}-${index}`}
                              >
                                <span className="admin-artist-song-name">
                                  <i className="fa-solid fa-music"></i>
                                  {GetSongTitle(song)}
                                </span>

                                <button
                                  type="button"
                                  className="admin-artist-remove-song"
                                  onClick={() =>
                                    RemovePopularSong(artist, song)
                                  }
                                  disabled={isSaving}
                                  title="Remove popular song"
                                  aria-label={`Remove ${GetSongTitle(song)}`}
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {artistMessages[artist._id] && (
                          <p
                            className={`admin-artist-message ${
                              artistMessages[artist._id].type === "error"
                                ? "is-error"
                                : "is-success"
                            }`}
                          >
                            {artistMessages[artist._id].message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-artist-actions">
                  <button
                    type="button"
                    className="admin-artist-edit-btn"
                    onClick={() =>
                      navigate(`/adminhome/adminartists/edit/${artist._id}`, {
                        state: { artist },
                      })
                    }
                    title="Edit artist"
                    aria-label="Edit artist"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    type="button"
                    className="admin-artist-delete-btn"
                    onClick={() => RemoveArtist(artist._id)}
                    title="Delete artist"
                    aria-label="Delete artist"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminArtists;