import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { API_URL } from "../../constants";
import { formatTime, getFullDay, getAvails } from "./utils";
import AddAvailabilityModal from "./components/AddAvailabilityModal";
import {
    Container,
    Row,
    Col,
    Table,
  } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

function ReceiverAvailability() {
  // Define the state for availability endpoint data and add modal visibility
  const [availabilityData, setAvailabilityData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchParams, _getSearchParams] = useSearchParams();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Fetch availability list endpoint call
  // TBD: need to replace 1 with userid
  useEffect(() => {
    axios
      .get(`${API_URL}receiver_avail/overview/`, {})
      .then((response) => {
        let c = searchParams.get('contact');
        let s = searchParams.get('schedule');
        setAvailabilityData(getAvails(c, s, response.data));
      })
      .catch((error) => {
        console.error("Error fetching availability data:", error);
      });
  }, []);

  // Confirm creation endpoint call
  const confirmAddAvailability = (newAvailability) => {
    let c = searchParams.get('contact');
    let s = searchParams.get('schedule');
    newAvailability['corresponding_contact'] = c;
    newAvailability['corresponding_schedule'] = s;
    axios
      .post(`${API_URL}receiver_avail/create/`, newAvailability, {
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
      .delete(`${API_URL}receiver_avail/${id}/delete/`, {})
      .then((response) => {
        setAvailabilityData(
          availabilityData.filter((availability) => availability.id !== id)
        ); // Remove the deleted availability from the state
      })
      .catch((error) => {
        console.error("Error deleting availability:", error);
      });
  };

  return (
    <Container fluid className="px-0">
      <Row
        className="flex-nowrap"
        style={{ overflowY: "hidden", width: "100vw" }}
      >
        <div
          className="col px-2 py-2"
          style={{ paddingLeft: 0, margin: "1rem" }}
        >
          <div className="availability-header-container">
            <h1>Specify your availability!</h1>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Duration(minutes)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availabilityData.map((availability) => (
                <tr key={availability.id}>
                  <td>{getFullDay(availability.day)}</td>
                  <td>{formatTime(availability.start_time)}</td>
                  <td>{availability.duration}</td>
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
          </Table>
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
      </Row>
    </Container>
  );
}

export default ReceiverAvailability;
