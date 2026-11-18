import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminUserPlaylist.css";
import api from "../../utils/AxiosConfig";

function AdminUserPlaylists({ userId }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const GetUserId = (item) =>
    item?._id ?? item?.user_id ?? item?.userId ?? null;

  const GetUserName = (item) =>
    item?.name ||
    item?.username ||
    item?.fullName ||
    item?.fullname ||
    "Spotify User";

  const GetUserEmail = (item) =>
    item?.email || item?.email_id || item?.emailId || "";

  const GetUserImage = (item) =>
    item?.image ||
    item?.profileImage ||
    item?.profile_image ||
    item?.avatar ||
    "";

  const GetPlaylistName = (playlist) =>
    playlist?.name ||
    playlist?.title ||
    playlist?.playlistName ||
    "Untitled Playlist";

  const GetPlaylistImage = (playlist) =>
    playlist?.image ||
    playlist?.coverImage ||
    playlist?.cover_image ||
    playlist?.thumbnail ||
    "";

  const GetPlaylistSongs = (playlist) =>
    playlist?.songs ??
    playlist?.songIds ??
    playlist?.song_ids ??
    playlist?.tracks ??
    [];

  const GetPlaylistOwnerId = (playlist) => {
    const owner =
      playlist?.user_id ??
      playlist?.userId ??
      playlist?.owner_id ??
      playlist?.ownerId ??
      playlist?.user;

    if (owner && typeof owner === "object") {
      return owner._id ?? owner.user_id ?? owner.userId ?? null;
    }

    return owner ?? null;
  };

  const GetSongName = (song, index) => {
    if (typeof song === "string") return `Song ${index + 1}`;

    return (
      song?.title ||
      song?.name ||
      song?.song_name ||
      song?.songName ||
      `Song ${index + 1}`
    );
  };

  const GetSongArtist = (song) => {
    if (!song || typeof song !== "object") return "";

    const artist = song.artist;

    return (
      song.artist_name ||
      song.artistName ||
      (typeof artist === "string" ? artist : artist?.name) ||
      song.singer ||
      ""
    );
  };

  const GetSongImage = (song) => {
    if (!song || typeof song !== "object") return "";

    return (
      song.image ||
      song.coverImage ||
      song.cover_image ||
      song.thumbnail ||
      song.albumImage ||
      ""
    );
  };

  const GetSongDuration = (song) => {
    if (!song || typeof song !== "object") return "";

    const duration =
      song.duration_formatted || song.durationFormatted || song.duration || "";

    if (typeof duration === "string") return duration;

    if (typeof duration === "number" && Number.isFinite(duration)) {
      const seconds = Math.floor(duration / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    return "";
  };

  useEffect(() => {
    let active = true;

    const LoadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [userResponse, playlistResponse] = await Promise.all([
          api.get("/adminusers"),
          api.get(`/adminplaylists?user_id=${encodeURIComponent(userId)}`),
        ]);

        const userList =
          userResponse.data.users ?? userResponse.data.data ?? [];

        const playlistList =
          playlistResponse.data.playlists ?? playlistResponse.data.data ?? [];

        if (!Array.isArray(userList)) {
          throw new Error("Invalid users response from backend.");
        }

        if (!Array.isArray(playlistList)) {
          throw new Error("Invalid playlists response from backend.");
        }

        const foundUser = userList.find(
          (item) => String(GetUserId(item)) === String(userId),
        );

        const userPlaylists = playlistList.filter((playlist) => {
          const ownerId = GetPlaylistOwnerId(playlist);

          return (
            ownerId !== null &&
            ownerId !== undefined &&
            String(ownerId) === String(userId)
          );
        });

        if (active) {
          setUser(foundUser ?? null);
          setPlaylists(userPlaylists);
        }
      } catch (e) {
        console.error("Get User Playlists Error:", e);

        if (active) {
          setError(
            e.response?.data?.message ||
              e.message ||
              "Unable to load this user's playlists.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (userId) {
      LoadData();
    } else {
      setError("User ID is missing.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [userId]);

  const filteredPlaylists = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return playlists;

    return playlists.filter((playlist) =>
      GetPlaylistName(playlist).toLowerCase().includes(searchText),
    );
  }, [playlists, search]);

  return (
    <div className="admin-user-playlists">
      <div className="admin-user-playlists-header">
        <div>
          <p className="admin-user-playlists-eyebrow">USER MANAGEMENT</p>

          <h1>User Playlists</h1>

          <p className="admin-user-playlists-subtitle">
            View playlists created by this Spotify user.
          </p>
        </div>

        <button
          type="button"
          className="admin-user-playlists-back-btn"
          onClick={() => navigate("/adminhome/adminusers")}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Users
        </button>
      </div>

      {user && (
        <div className="admin-user-playlists-profile">
          <div className="admin-user-playlists-avatar">
            {GetUserImage(user) ? (
              <img
                src={GetUserImage(user)}
                alt={GetUserName(user)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              GetUserName(user).charAt(0).toUpperCase()
            )}
          </div>

          <div className="admin-user-playlists-profile-info">
            <span>PLAYLISTS BELONGING TO</span>
            <h2>{GetUserName(user)}</h2>
            <p>{GetUserEmail(user)}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="admin-user-playlists-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="admin-user-playlists-toolbar">
        <div>
          <h2>Playlists</h2>
          <p>
            {playlists.length}{" "}
            {playlists.length === 1 ? "playlist" : "playlists"}
          </p>
        </div>

        <div className="admin-user-playlists-search">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="admin-user-playlists-status">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Loading playlists...</p>
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="admin-user-playlists-status">
          <i className="fa-solid fa-music"></i>

          <h3>{search ? "No matching playlists" : "No playlists found"}</h3>

          <p>
            {search
              ? "Try searching with another playlist name."
              : "This user does not have any playlists to display."}
          </p>
        </div>
      ) : (
        <div className="admin-user-playlists-list">
          {filteredPlaylists.map((playlist, index) => {
            const playlistId =
              playlist._id ??
              playlist.playlist_id ??
              playlist.playlistId ??
              index;

            const songs = GetPlaylistSongs(playlist);
            const songList = Array.isArray(songs) ? songs : [];
            const isOpen = String(expandedPlaylist) === String(playlistId);

            const image = GetPlaylistImage(playlist);
            const createdAt = playlist.created_at ?? playlist.createdAt;

            return (
              <div
                className={`admin-user-playlists-card ${
                  isOpen ? "is-open" : ""
                }`}
                key={playlistId}
              >
                <div className="admin-user-playlists-card-top">
                  <div className="admin-user-playlists-cover">
                    {image ? (
                      <img
                        src={image}
                        alt={GetPlaylistName(playlist)}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <i className="fa-solid fa-music"></i>
                    )}
                  </div>

                  <div className="admin-user-playlists-card-heading">
                    <h3>{GetPlaylistName(playlist)}</h3>

                    <p>
                      <i className="fa-solid fa-music"></i>
                      {songList.length}{" "}
                      {songList.length === 1 ? "song" : "songs"}
                    </p>

                    {createdAt && (
                      <span className="admin-user-playlists-date">
                        Created{" "}
                        {new Date(createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="admin-user-playlists-toggle"
                    onClick={() =>
                      setExpandedPlaylist(isOpen ? null : playlistId)
                    }
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Collapse ${GetPlaylistName(playlist)}`
                        : `Expand ${GetPlaylistName(playlist)}`
                    }
                  >
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>

                {isOpen && (
                  <div className="admin-user-playlist-songs">
                    <p className="admin-user-playlist-songs-title">
                      <i className="fa-solid fa-music"></i>
                      Songs in this playlist
                    </p>

                    {songList.length === 0 ? (
                      <p className="admin-user-playlist-empty-songs">
                        No songs in this playlist.
                      </p>
                    ) : (
                      songList.map((song, songIndex) => {
                        const songId =
                          typeof song === "object" && song !== null
                            ? (song._id ??
                              song.song_id ??
                              song.songId ??
                              songIndex)
                            : songIndex;

                        const songName = GetSongName(song, songIndex);
                        const artist = GetSongArtist(song);
                        const songImage = GetSongImage(song);
                        const duration = GetSongDuration(song);

                        return (
                          <div
                            className="admin-user-playlist-song"
                            key={songId}
                          >
                            <span className="admin-user-playlist-song-number">
                              {songIndex + 1}
                            </span>

                            <div className="admin-user-playlist-song-image">
                              {songImage ? (
                                <img
                                  src={songImage}
                                  alt={songName}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <i className="fa-solid fa-music"></i>
                              )}
                            </div>

                            <div className="admin-user-playlist-song-info">
                              <h4>{songName}</h4>
                              <p>{artist || "Unknown Artist"}</p>
                            </div>

                            {duration && (
                              <span className="admin-user-playlist-song-duration">
                                {duration}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminUserPlaylists;
