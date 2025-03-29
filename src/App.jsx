import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import TenderList from "./components/TenderList/TenderList";
import CreateTender from "./components/CreateTender/CreateTender";
import CreateUser from "./components/CreateUser/CreateUser";
import DetailedInfo from "./components/DetailedInfo/DetailedInfo";
import SubmitBid from "./components/SubmitBid/SubmitBid";
import { ConfirmProvider } from "material-ui-confirm";
import Home from "./components/Home/Home";

import "./App.css";
import CompanyPage from "./components/companyPage/CompanyPage";
import CompanyBids from "./components/companyBids/CompanyBids";
import UpdateTender from "./components/UpdateTender/UpdateTender";
import CitizenPage from "./components/citizenPage/CitizenPage";
import CitizenFeedback from "./components/citizenPage/CitizenFeedback";
import ViewFeedback from "./components/citizenPage/ViewFeedback";
import OpenTenders from "./components/citizenPage/OpenTenders";
import ClosedTenders from "./components/citizenPage/ClosedTenders";
import AllFeedbacks from "./components/citizenPage/AllFeedbacks";
import TenderDetails from "./components/citizenPage/TenderDetails";
import CityPage from "./components/cityPage/CityPage";
import ManageCategories from "./components/cityPage/ManageCategories"; // Import the new component
import ManageUsers from "./components/cityPage/ManageUsers";
import ViewAllTenders from "./components/cityPage/ViewAllTenders";

function App() {
  const [isCompany, setIsCompany] = useState(false);
  const [isCity, setIsCity] = useState(false);
  const [isCitizen, setIsCitizen] = useState(false);
  const [user, setUser] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    fetchTenders();
    fetchBids();

    const interval = setInterval(() => {
      updateTenderStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const updateTenderStatus = (tendersToUpdate = tenders) => {
    if (!tendersToUpdate || tendersToUpdate.length === 0)
      return tendersToUpdate;

    const currentDate = new Date();
    const updatedTenders = tendersToUpdate.map((tender) => {
      const noticeDate = new Date(tender.date_of_tender_notice);
      const closeDate = new Date(tender.date_of_tender_close);

      if (closeDate <= noticeDate) {
        console.error(
          `Invalid dates for tender ${tender.tender_id}: date_of_tender_close (${closeDate}) must be greater than date_of_tender_notice (${noticeDate})`
        );
        return { ...tender, status: "Invalid" };
      }

      let newStatus;
      if (currentDate < noticeDate) {
        newStatus = "Pending";
      } else if (currentDate >= noticeDate && currentDate <= closeDate) {
        newStatus = "Open";
      } else {
        newStatus = "Closed";
      }

      return { ...tender, tender_status: newStatus };
    });

    setTenders(updatedTenders);
    return updatedTenders;
  };

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/find`);
      const fetchedTenders = response.data;
      const updatedTenders = updateTenderStatus(fetchedTenders);
      setTenders(updatedTenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await axios.get(`${API_URL}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handleLogin = async (email, password, id) => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;

      const user = users.find(
        (u) =>
          (u.email === email || u.user_id === id) && u.password === password
      );

      if (!user) {
        throw new Error(
          "Invalid email, user ID, or password. Please try again."
        );
      }

      if (user.user_type === "City") {
        setIsCity(true);
        setIsCompany(false);
        setIsCitizen(false);
      } else if (user.user_type === "Company") {
        setIsCity(false);
        setIsCompany(true);
        setIsCitizen(false);
      } else {
        setIsCitizen(true);
        setIsCity(false);
        setIsCompany(false);
      }
      if (!user) {
        throw new Error("Invalid user. Try again");
      }

      localStorage.setItem("user", JSON.stringify(user));

      setUser({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        address: user.address,
        user_type: user.user_type,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    setIsCompany(false);
    setIsCity(false);
    setUser(null);
  };

  const submitBid = async (tender_id, amount, user_id) => {
    const bidData = {
      amount: amount,
      user_id: user_id,
      tender_id: tender_id,
    };
    console.log("Bid Data:", bidData);
    console.log("User ID:", user_id);
    console.log("Tender ID:", tender_id);

    try {
      const response = await axios.post(
        "http://localhost:5500/create_bid",
        bidData
      );
    } catch (error) {
      console.error(
        "Error submitting bid:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isCompany || isCity || isCitizen}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/"
            element={
              isCompany ? (
                <>
                  <CompanyPage user={user}></CompanyPage>
                  <TenderList
                    tenders={tenders}
                    isCompany={isCompany}
                    isCity={isCity}
                    isCitizen={isCitizen}
                  />
                </>
              ) : isCitizen ? (
                <CitizenPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/company/bids"
            element={
              isCompany ? <CompanyBids user={user} /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
              isCompany || isCitizen ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route path="/create-user" element={<CreateUser />} />
          <Route
            path="/create-tender"
            element={
              isCity ? (
                <CreateTender
                  setTenders={setTenders}
                  fetchTenders={fetchTenders}
                  user_id={user.user_id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/update-tender/:id"
            element={
              isCity ? (
                <UpdateTender
                  tenders={tenders}
                  fetchTenders={fetchTenders}
                  user_id={user.user_id}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/tender/:id/details"
            element={
              <ConfirmProvider>
                <DetailedInfo
                  tenders={tenders}
                  fetchTenders={fetchTenders}
                  user={user}
                />
              </ConfirmProvider>
            }
          />
          <Route
            path="/tender/:id/bid"
            element={
              isCompany ? (
                <SubmitBid tenders={tenders} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/feedback"
            element={
              isCitizen ? (
                <CitizenFeedback user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/view-feedback"
            element={
              isCitizen ? (
                <ViewFeedback user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/open-tenders"
            element={
              isCitizen ? (
                <OpenTenders tenders={tenders} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/closed-tenders"
            element={
              isCitizen ? (
                <ClosedTenders tenders={tenders} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/all-feedbacks"
            element={
              isCitizen ? (
                <AllFeedbacks />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/citizen/tender-details/:id"
            element={
              isCitizen ? (
                <TenderDetails />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/city/dashboard"
            element={
              isCity ? (
                <CityPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/manage-categories"
            element={
              isCity ? (
                <ManageCategories />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/manage-users"
            element={
              isCity ? (
                <ManageUsers />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/view-all-tenders"
            element={
              isCity ? (
                <ViewAllTenders />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
export { App };