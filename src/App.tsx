import React from "react";
import "./App.css";
import "./Assets/styles/styles.scss";
import Home from "./Components/Home";
import Header from "./Components/Header";
import BusinessDetail from "./Components/BusinessDetail";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";

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
      {location.pathname === "/404" ? null : <Header />}
      <Routes>
        {/* <Route path='/' element={<Home/>}></Route> */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/business" element={<BusinessDetail />}></Route>
        <Route path="/404" element={<NotFound />}></Route>
        <Route path="*" element={<Navigate to="/404" replace />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route element={<PrivateRoutes/>}>
          <Route path='/' element={<Home/>}></Route>
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
