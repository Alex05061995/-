import React from "react";
import Navbar from '../components/navbar/Navbar.jsx';
import './app.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Registration from "./registration/Registration.jsx";
import Authorization from "./authorization/Authorization.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { auth } from "../actions/user.js";
import Disk from "./disk/Disk.jsx";
import Profile from "./profile/Profile.jsx";

function App() {

  const isAuth = useSelector(state => state.user.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth())
  }, [])

  return (

    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className='wrap'>
          {!isAuth ?
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Authorization />} />
              <Route path="*" element={<Navigate to='/login' />} />
            </Routes>
            :
            <Routes>
              <Route exact path="/" element={<Disk />} />
              <Route path="*" element={<Navigate to='/' />} />
              <Route exact path="/profile" element={<Profile />} />
            </Routes>
          }
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
