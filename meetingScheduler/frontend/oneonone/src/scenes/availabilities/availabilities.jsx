import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { API_URL } from "../../constants";
import { formatTime, getFullDay, getPriorityLabel } from "./utils";
import AddAvailabilityModal from "./components/AddAvailabilityModal";
import NavBar from "../navBar/navBar";
import { Container } from "react-bootstrap";

function Availability() {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Fetch availability list endpoint call
  useEffect(() => {
    axios
      .get(`${API_URL}sender/availability/list/`, {})
      .then((response) => {
        setAvailabilityData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching availability data:", error);
      });
  }, []);

  // Confirm creation endpoint call
  const confirmAddAvailability = (newAvailability) => {
    axios
      .post(`${API_URL}sender/availability/create/`, newAvailability, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAvailabilityData([...availabilityData, response.data]);
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error creating availability:", error);
      });
  };

  // Deletion endpoint call
  const deleteAvailability = (id) => {
    axios
      .delete(`${API_URL}sender/availability/delete/${id}/`, {})
      .then((response) => {
        setAvailabilityData(
          availabilityData.filter((availability) => availability.id !== id),
        );
      })
      .catch((error) => {
        console.error("Error deleting availability:", error);
      });
  };

  return (
    <Container fluid className="px-0">
      <div
        className="row flex-nowrap"
        style={{ height: "100vh", overflowY: "hidden" }}
      >
        <div
          className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark"
          style={{ paddingTop: "1.5rem" }}
        >
          <NavBar />
        </div>
        <div
          className="col px-2 py-2"
          style={{ paddingLeft: 0, margin: "1rem" }}
        >
          <div className="availability-header-container">
            <h1>Availability</h1>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Duration(minutes)</th>
                <th>Preference</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availabilityData.map((availability) => (
                <tr key={availability.id}>
                  <td>{getFullDay(availability.day)}</td>
                  <td>{formatTime(availability.start_time)}</td>
                  <td>{availability.duration}</td>
                  <td>{getPriorityLabel(availability.priority)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAvailability(availability.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
            <AddAvailabilityModal
              toggleModal={toggleModal}
              confirmAddAvailability={confirmAddAvailability}
            />
          )}
          <button className="btn btn-primary" onClick={toggleModal}>
            Add Availability
          </button>
        </div>
      </div>
    </Container>
  );
}

export default Availability;
