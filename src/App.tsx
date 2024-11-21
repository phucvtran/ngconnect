import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Assets/styles/styles.scss'
import Home from './Components/Home';
import Header from './Components/Header';
import BusinessDetail from './Components/BusinessDetail';
import {Routes, Route, Navigate, useLocation, Outlet} from "react-router-dom"


const NotFound = () => {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for could not be found.</p>
    </>
  );
};

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/404' ? null : <Header/> }
      <Routes>
        {/* <Route path='/' element={<Home/>}></Route> */}
        <Route path='/' element={<Home/>}></Route>
        <Route path='/business' element={<BusinessDetail/>}></Route>
        <Route path='/404' element={<NotFound/>}></Route>
        <Route path="*" element={<Navigate to="/404" replace />}></Route>
        
        {/* <Route element={<PrivateRoutes/>}>
          <Route path='/' element={<Home/>}></Route>
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
