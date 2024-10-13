import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Availabilities from "./scenes/availabilities/availabilities";
import Schedules from "./scenes/scheduels/schedules";
import CreateSchedules from "./scenes/createSchedules/createScheduels";
import ArchivedMeetings from "./scenes/archivedMeetings/archivedMeetings";
import Invites from "./scenes/invites/invites";
import SuggestedSchedules from "./scenes/suggestedSchedules/suggestedScheudles";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./scenes/login/login";
import SignUp from "./scenes/signup/signup";
import ProtectedRoute from "./auth/ProtectedRoute";
import Contacts from "./scenes/contacts/contacts";
import ReceiverAvailability from "./scenes/receiverAvail/availabilities";
import UserSettings from "./scenes/settings/settings";

import axios from "axios";
import LandingPage from "./scenes/landingPage/landingPage";

axios.defaults.withCredentials = true;

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/schedules"
              element={
                <ProtectedRoute>
                  <Schedules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/availabilities"
              element={
                <ProtectedRoute>
                  <Availabilities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-schedules"
              element={
                <ProtectedRoute>
                  <CreateSchedules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archived-meetings"
              element={
                <ProtectedRoute>
                  <ArchivedMeetings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invites"
              element={
                <ProtectedRoute>
                  <Invites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suggested-schedules"
              element={
                <ProtectedRoute>
                  <SuggestedSchedules />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <UserSettings />
                </ProtectedRoute>
              }
            />
            <Route path="/receiver_avail" element={<ReceiverAvailability />} />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
