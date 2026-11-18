import React from 'react'
import AdminSidebar from './AdminSidebar'
import '../styles/AdminHome.css'
import AdminDashboard from './AdminDashboard'
import AdminSongs from './AdminSongs'
import { useLocation } from 'react-router-dom'
import AddAdminSongs from './AddAdminSong'
import EditAdminSong from './EditAdminSong'
import AdminArtists from './AdminArtists'
import AddAdminArtists from './AddAdminArtists'
import EditAdminArtists from './EditAdminArtists'
import AdminAds from './AdminAds'
import AdminBrowseCategory from './AdminBrowseCategory'
import AddAdminBrowseCategory from './AddAdminBrowseCategory'
import AdminUsers from './AdminUsers'
import AdminUserPlaylists from './AdminUserPlaylist'
import CheckToken from '../../utils/CheckToken'
import AdminProfile from './AdminProfile'

function AdminHome() {
  let location = useLocation()
   if (!CheckToken()) {
    return <Navigate to="/" replace />;
  }
  let songId = location.pathname.split('/')[4]
  let artistId = location.pathname.split("/")[4];
  const playlistMatch = location.pathname.match(/^\/adminhome\/adminusers\/([^/]+)\/playlists$/);
  const userId = playlistMatch ? decodeURIComponent(playlistMatch[1]) : null;

  return (
    <div className='admin-home'>
      <AdminSidebar/>
      <div className='admin-main'>
        {(location.pathname === '/adminhome' || location.pathname === '/adminhome/admindashboard') && <AdminDashboard/>}
        {location.pathname === '/adminhome/adminsongs' && <AdminSongs/>}
        {location.pathname === '/adminhome/adminsongs/add' && <AddAdminSongs/>}
        {location.pathname === `/adminhome/adminsongs/edit/${songId}` && songId && <EditAdminSong id={songId} />}      
        {location.pathname === "/adminhome/adminartists" && <AdminArtists/>}
        {location.pathname === "/adminhome/adminartists/add" && <AddAdminArtists/>}
        {location.pathname === `/adminhome/adminartists/edit/${artistId}` && artistId && <EditAdminArtists id={artistId} />}
        {location.pathname === "/adminhome/adminads" && <AdminAds/>}
        {location.pathname === "/adminhome/admincategories" && <AdminBrowseCategory/>}
        {location.pathname === "/adminhome/admincategories/add" && <AddAdminBrowseCategory/>}
        {location.pathname === "/adminhome/adminusers" && <AdminUsers/>}
        {location.pathname === `/adminhome/adminusers/${userId}/playlists` && userId && <AdminUserPlaylists key={userId} userId={userId}/>}
        {location.pathname === "/adminhome/adminprofile" && <AdminProfile/>}
    </div>
    </div>
  )
}

export default AdminHome