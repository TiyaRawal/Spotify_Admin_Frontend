import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSongs.css";
import api from "../../utils/AxiosConfig";

function AdminSongs() {
  let [songs, setSongs] = useState([]);
  let navigate = useNavigate();

  let GetSongs = async () => {
    try {
      let response = await api.get("/adminsongs");
      setSongs(response.data.songs);
    } catch (e) {
      console.log(e);
    }
  };

  let DeleteSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return;
    }

    try {
      let response = await api.delete(`/adminsongs/${id}`);

      if (response.data.success) {
        alert(response.data.message);
        GetSongs();
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete song");
    }
  };

  useEffect(() => {
    GetSongs();
  }, []);

  return (
    <div className="admin-songs">
      <div className="admin-songs-header">
        <div>
          <h1>Songs</h1>
          <p>Manage your music library</p>
        </div>

        <Link to="/adminhome/adminsongs/add" className="admin-add-song-btn">
          <i className="fa-solid fa-plus"></i>
          Add Song
        </Link>
      </div>

      <div className="admin-songs-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Search songs..." />
      </div>

      <div className="admin-songs-table-container">
        <table className="admin-songs-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Year</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {songs.map((song) => (
              <tr key={song._id}>
                <td>
                  <img
                    className="admin-song-image"
                    src={song.image}
                    alt={song.title}
                  />
                </td>

                <td className="admin-song-title">{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.year}</td>
                <td>{song.duration}</td>

                <td>
                  <div className="admin-song-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() =>
                        navigate(`/adminhome/adminsongs/edit/${song._id}`, {
                          state: { song },
                        })
                      }
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() => DeleteSong(song._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {songs.length === 0 && (
              <tr>
                <td colSpan="7">No songs available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSongs;