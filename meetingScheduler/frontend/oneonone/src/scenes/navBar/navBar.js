import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../auth/AuthContext";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    redirect("/");
  };
  return (
    <div style={{ fontWeight: "bold", fontFamily: "Georgia, serif" }}>
      <header>
        <p
          style={{
            color: "white",
            marginLeft: "1rem",
            fontSize: "1.5rem",
            textAlign: "start",
          }}
        >
          Dashboard
        </p>
        <ul className="nav flex-column">
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/schedules" className="nav-link">
              Schedules
            </Link>
          </li>
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/create-schedules" className="nav-link">
              + Create Schedules
            </Link>
          </li>
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/availabilities" className="nav-link">
              Availabilities
            </Link>
          </li>
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/archived-meetings" className="nav-link">
              Archived Meetings
            </Link>
          </li>
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/invites" className="nav-link">
              Invites
            </Link>
          </li>
          <li className="nav-item" style={{ textAlign: "start" }}>
            <Link to="/contacts" className="nav-link">
              Contacts
            </Link>
          </li>
        </ul>
        <div className="user-dropdown" style={{ position: "absolute", bottom: "0", left: "1rem", marginTop: "20px", marginBottom: "10px" }}>
          <button onClick={toggleDropdown} className="d-flex align-items-center text-white text-decoration-none bg-transparent border-0" style={{ cursor: "pointer" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt="User" width="30" height="30" className="rounded-circle"/>
            <span style={{ marginLeft: "10px" }}>User</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content" style={{ 
              position: "absolute", 
              bottom: "100%", // Positions the dropdown above the button
              left: "0",
              backgroundColor: "#343a40", 
              padding: "10px", 
              borderRadius: "5px",
              zIndex: 1000 // Ensure it's above other content
            }}>
              <Link to="/settings" className="dropdown-item" style={{ color: "white", textDecoration: "none" }}>Settings</Link>
              <hr style={{ margin: "5px 0" }}/>
              <Link to="#" className="dropdown-item" style={{ color: "white", textDecoration: "none" }} onClick={handleLogout}>Sign out</Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default NavBar;
