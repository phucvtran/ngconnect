import React from "react";
import "./App.css";
import "./Assets/styles/styles.scss";
import Home from "./Components/Home";
import Header from "./Components/Header";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import ListingDetailView from "./Components/ListingDetailView/ListingDetailView";
import GlobalAlert from "./Components/GlobalAlert";
import PrivateRoutes from "./Components/Authentication/PrivateRoutes";
import { AuthProvider } from "./Components/Authentication/useAuth";
import CreateListing from "./Components/CreateListing";
import JobDetailView from "./Components/ListingDetailView/JobDetailView";

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
      <GlobalAlert />
      <AuthProvider>
        {location.pathname === "/404" ? null : <Header />}
        <Routes>
          {/* <Route path='/' element={<Home/>}></Route> */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/404" element={<NotFound />}></Route>
          <Route path="*" element={<Navigate to="/404" replace />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:listingId" element={<ListingDetailView />} />
          <Route path="/listings/jobs/:listingId" element={<JobDetailView />} />

          {/*  Put protected routes here  */}
          <Route element={<PrivateRoutes />}>
            <Route path="/createListing" element={<CreateListing />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
