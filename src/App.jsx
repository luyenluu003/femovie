import React, { useEffect } from "react"
import { Routes, Route} from 'react-router-dom'
import Home from "./pages/home/home"
import Login from "./pages/auth/login"
import ResetPassword from "./pages/auth/ResetPassword"
import { ToastContainer } from "react-toastify"
import AutoLogout from "./context/AutoLogout"
import Movies from "./pages/movies/Movies"
import Detail from "./pages/Detail/Detail"
import DetailActor from "./pages/Detail/DetailActor"
import VideoPlayer from "./pages/videoplayer/VideoPlayer"
import PageSeries from "./pages/series/PageSeries"
import PageMovieHot from "./pages/movieHot/PageMovieHot"
import Playlist from "./pages/PlayList/Playlist"
import VipPackage from "./pages/paypal/VipPackage"
import Success from "./pages/paypal/Success"
import Cancel from "./pages/paypal/Cancel"
import Profile from "./pages/user/Profile"

const App = () => {



  return (
    <div>
      <ToastContainer />
      <AutoLogout/>
        <Routes>
          <Route path="/" element ={<Home/>}/>
          <Route path="/login" element = {<Login/>} />
          <Route path="/resetpassword" element = {<ResetPassword/>}/>
          <Route path="/movies" element={<Movies />}/>
          <Route path="/series" element={<PageSeries />}/>
          <Route path="/moviehots" element={<PageMovieHot />}/>
          <Route path="/movie-detail/:movieCode" element={<Detail />} />
          <Route path="/movie/video-player/:movieCode" element={<VideoPlayer />} />
          <Route path="/my-lists/:userId" element={<Playlist />} />
          <Route path="/actor/:actorId" element={<DetailActor />} />
          <Route path="/vip" element={<VipPackage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
    </div>
  )
}

export default App