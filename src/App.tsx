import React from "react";
import "./App.css";
import "./Assets/styles/styles.scss";
import Home from "./Components/Home";
import Header from "./Components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import ListingDetailView from "./Components/ListingDetailView/ListingDetailView";
import GlobalAlert from "./Components/GlobalAlert";
import PrivateRoutes from "./Components/Authentication/PrivateRoutes";
import CreateListing from "./Components/CreateListing";
import JobDetailView from "./Components/ListingDetailView/JobDetailView";
import Dashboard from "./Components/Dashboard";
import MyJobDetailView from "./Components/ListingDetailView/MyJobDetailView";
import InboxView from "./Components/ListingDetailView/InboxView";

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
      {location.pathname === "/404" ? null : <Header />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/404" element={<NotFound />}></Route>
        {/* <Route path="*" element={<Navigate to="/404" replace />}></Route> */}
        <Route path="/listings/:listingId" element={<ListingDetailView />} />
        <Route path="/listings/jobs/:listingId" element={<JobDetailView />} />

        {/*  Put protected routes here  */}
        <Route element={<PrivateRoutes />}>
          <Route path="/createListing" element={<CreateListing />} />
          <Route path="/myPost" element={<Dashboard />} />
          <Route path="/inbox" element={<InboxView />} />
          <Route path="/myPost/jobs/:listingId" element={<MyJobDetailView />} />
          <Route path="/myPost/:listingId" element={<ListingDetailView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
