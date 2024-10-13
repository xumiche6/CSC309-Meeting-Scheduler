import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import { API_URL } from "../../constants";
import { Container, Row, Col, Table } from "react-bootstrap";
import {
  GetContactById,
  ConfirmationTD,
  GetFlattenedContacts,
  ReceiverFilter,
  GetScheduleById,
} from "./utils";
import AddInviteModal from "./components/addInviteModal";
import NavBar from "../navBar/navBar";

const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNDMzNzY1LCJpYXQiOjE3MTI0MzM0NjUsImp0aSI6IjVkNWFhYjEwMmE5ZjRiYTFiN2U5YWE0YmUwZTg4ZGM2IiwidXNlcl9pZCI6MX0.gScRzyRp1Nv02c1r6oXorVLYjJRmUNDU7LjvSR3qtuw";

function Invites() {
  const [inviteData, setInviteData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const [contactFilter, setContactFilter] = useState(0);
  const [filteredInvites, setFilteredInvites] = useState([]);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const toggleInviteModal = () => {
    setShowInviteModal(!showInviteModal);
  };

  // this will make an api call to get the invites of the currently logged in user
  useEffect(() => {
    axios
      .get(`${API_URL}invites/overview/`, {})
      .then((response) => {
        setInviteData(response.data);
        setFilteredInvites(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invite data:", error);
      });
  }, []);
  // this second parameter is an array of dependencies, if it's just an empty list
  // then the callback function is called only on load or something

  // makes an api call to get the contacts of the currently logged in user
  // needed to match receiver ids to names
  useEffect(() => {
    axios
      .get(`${API_URL}contacts/list/`, {})
      .then((response) => {
        setContactData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contact data:", error);
      });
  }, []);

  // makes an api call to get the currently logged in user's schedules
  useEffect(() => {
    axios
      .get(`${API_URL}schedules/all/`, {})
      .then((response) => {
        setScheduleData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule data:", error);
      });
  }, []);

  // to test the receiver avails. remove later
  const [receiverAvails, setReceiverAvails] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}receiver_avail/overview/`, {})
      .then((response) => {
        setReceiverAvails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching receiver availability data:", error);
      });
  }, []);

  // filter out the invites based on the receiver
  const receiverFilter = (e) => {
    var contact = document.getElementById("receiverFilter").value;
    if (!(contact === "Default")) {
      var contact = Number(document.getElementById("receiverFilter").value);
    }
    setContactFilter(contact);
    setFilteredInvites(ReceiverFilter(inviteData, contact));
  };

  // make an api call to send an invite
  const sendInvite = (newInvite) => {
    axios
      .post(`${API_URL}invites/send/`, newInvite, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setInviteData([...inviteData, response.data]);
        setShowInviteModal(false);
      })
      .catch((error) => {
        console.error("Error sending invite:", error);
      });
  };

  // make an api call to send a reminder
  const sendReminder = (schedID, contactID) => {
    const reminderData = {
      receiver: contactID,
      schedule: schedID,
    };

    alert("Reminder sent!");

    axios
      .post(`${API_URL}invites/reminder/`, reminderData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Error sending invite:", error);
      });
  };

  // the bulk of what gets rendered
  return (
    <Container fluid className="px-0">
      <Row
        className="flex-nowrap"
        style={{ overflowY: "hidden", width: "100vw" }}
      >
        <Col
          auto="true"
          md={3}
          xl={2}
          className="px-sm-2 px-0 bg-dark"
          style={{ paddingTop: "1.5rem", minHeight: "100vh" }}
        >
          <NavBar />
        </Col>
        {/*Beginning of main content column*/}
        <Col style={{ paddingLeft: 0, margin: "1rem" }}>
          <div className="invite-header-container">
            <h1>Sent Invites</h1>
          </div>
          <select id="receiverFilter" onChange={receiverFilter}>
            <option value="Default" selected="">
              --Filter by contact--
            </option>
            {GetFlattenedContacts(inviteData).map((contact) => (
              <option value={contact}>
                {GetContactById(contact, contactData)}
              </option>
            ))}
          </select>
          {/*invites table*/}
          <Table striped bordered hover>
            <thead className="thead-light">
              <tr className="table-dark">
                <th scope="col">Contact</th>
                <th scope="col">Date sent</th>
                <th scope="col">Meeting</th>
                <th scope="col">Invite Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredInvites.map((invite) => (
                <tr key={invite.id}>
                  <td>{GetContactById(invite.receiver, contactData)}</td>
                  <td>{invite.date_sent}</td>
                  <td>{GetScheduleById(invite.schedule, scheduleData)}</td>{" "}
                  {/*Need to replace this with a helper as well (lmao nvm schedules don't have names how did this happen)*/}
                  {ConfirmationTD(invite.confirmation)}
                  <td>
                    {invite.confirmation ? (
                      "no action needed"
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          sendReminder(invite.schedule, invite.receiver)
                        }
                      >
                        Send Reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="row px-3 py-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleInviteModal}
            >
              Send a new invite
            </button>
          </div>
          {/*end of invites table*/}

          {showInviteModal && (
            <AddInviteModal
              toggleInviteModal={toggleInviteModal}
              sendInvite={sendInvite}
              contacts={contactData}
              schedules={scheduleData}
            />
          )}
          {/*End of main content column*/}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          ></div>
          <div
            className="modal fade"
            id="sendInvite"
            tabIndex={-1}
            aria-labelledby="sendInviteLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="sendInviteLabel">
                    Send a new invite!
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <form id="sendInviteForm">
                    <div className="mb-3">
                      <label htmlFor="contactName" className="form-label">
                        Select Contact:{" "}
                      </label>
                      <select name="contacts" id="contactName">
                        <option value="">--Please choose an option--</option>
                        <option value="student1">Student 1</option>
                        <option value="student2">Student 2</option>
                        <option value="student3">Student 3</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="meeting" className="form-label">
                        Select Meeting:{" "}
                      </label>
                      <select name="meeting" id="meeting">
                        <option value="">--Please choose an option--</option>
                        <option value="phase1">Phase 1</option>
                        <option value="phase2">Phase 2</option>
                        <option value="oh">OH</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Send Invite
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Invites;
