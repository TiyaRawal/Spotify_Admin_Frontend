import React from 'react'
import '../styles/AdminLogin.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cookie from 'js-cookie'
import api from '../../utils/AxiosConfig'


function AdminLogin() {
  return (
    <div className='admin-login-bg'>
      <AdminLoginForm/>
    </div>
  )
}

function AdminLoginForm() {
  let navigate=useNavigate();
  let [admin,setAdmin]=useState({
    email:"",
    password:"",
  })

  function HandleInputChange(e){
    let{name,value}=e.target;
    setAdmin((prev)=>({
        ...prev,
        [name]:value
    }))
}

  let HandleSubmit=async(e)=>{
    e.preventDefault()
    try{
        let response=await api.post("/adminlogin",admin)
        if(response.status===200){
            setAdmin({
            email:"",
            password:"",
            })
            cookie.set("admintoken",response.data.token);
            alert(response.data.message);
            navigate("/adminhome")
        }
    }catch(e){
        alert(e.response?.data?.message || "Admin login failed!")
    }
  }

  return (
    <>
      <div className='admin-login-container'>
        <div className='spotify-logo'>
          <img src="https://res.cloudinary.com/yetzgheo/image/upload/v1790759048/spotify_sfn1lo.png" alt="Spotify Logo" />
        </div>

        <h1>Admin Login</h1>
        <form onSubmit={HandleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" onChange={HandleInputChange} value={admin.email} id="email" name="email" placeholder="Enter admin email" required/>
          <label htmlFor="password">Password</label>
          <input type="password" onChange={HandleInputChange} value={admin.password} id="password" name="password" placeholder="Enter password" required/>
          <button className='admin-login-btn' type="submit">Login</button>
        </form>

        <p className='admin-login-footer'>Admin access only</p>
      </div>
    </>
  )
}

export default AdminLogin