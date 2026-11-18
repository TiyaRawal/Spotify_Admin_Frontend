import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminHome from './pages/AdminHome'
import AdminDashboard from './pages/AdminDashboard'
import AdminSongs from './pages/AdminSongs'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminLogin/>}/>
      <Route path="/adminhome/*" element={<AdminHome/>}/>
      <Route path="/admindashboard" element={<AdminDashboard/>}/>
      <Route path="/adminsongs" element={<AdminSongs/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App