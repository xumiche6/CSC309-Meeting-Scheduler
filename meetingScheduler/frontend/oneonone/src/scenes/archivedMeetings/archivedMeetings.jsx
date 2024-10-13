import React, { useState, useEffect } from "react";
import { fetchSchedules, fetchMeetings } from "../scheduels/queries";
import "./style.css";
import { fetchContacts } from "../createSchedules/queries";
import NavBar from "../navBar/navBar";
import { Container } from "react-bootstrap";

function ArchivedMeetings() {
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    async function fetchContactsData() {
      try {
        const contactsData = await fetchContacts(); // Fetch contacts
        const contactsMap = contactsData.reduce((acc, contact) => {
          acc[contact.id] = contact.name;
          return acc;
        }, {});
        setContacts(contactsMap); // Store contacts in state
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
    fetchContactsData();
  }, []);

  const getContactName = (contactId) => {
    return contacts[contactId] || "Loading...";
  };

  useEffect(() => {
    // Fetch schedules when the component mounts
    async function getSchedules() {
      try {
        const schedulesData = await fetchSchedules();

        const archivedSchedules = schedulesData.filter(
          (schedule) => schedule.isArchived,
        );
        setSchedules(archivedSchedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }

    getSchedules();
  }, []);

  // Function to fetch meetings for the selected schedule
  useEffect(() => {
    async function getMeetings() {
      try {
        if (selectedScheduleId) {
          const meetingsData = await fetchMeetings(selectedScheduleId);
          setMeetings(meetingsData);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    }

    getMeetings();
  }, [selectedScheduleId]);

  // Event handler for dropdown selection change
  const handleScheduleChange = async (event) => {
    const scheduleName = event.target.value;
    if (scheduleName === "") {
      try {
        let allMeetings = [];
        for (const schedule of schedules) {
          const meetingsData = await fetchMeetings(schedule.id);
          allMeetings = [...allMeetings, ...meetingsData];
        }
        setMeetings(allMeetings);
      } catch (error) {
        console.error("Cannot fetching meetings:", error);
      }
      setSelectedScheduleId("");
      return;
    }

    const selectedSchedule = schedules.find(
      (schedule) => schedule.name === scheduleName,
    );
    if (selectedSchedule) {
      const scheduleId = selectedSchedule.id;
      console.log("scheduleId", scheduleId);
      setSelectedScheduleId(scheduleId);
    } else {
      console.error(`Schedule with name ${scheduleName} not found.`);
    }
  };

  useEffect(() => {
    async function fetchAllMeetings() {
      try {
        let allMeetings = [];
        for (const schedule of schedules) {
          const meetingsData = await fetchMeetings(schedule.id);
          allMeetings = [...allMeetings, ...meetingsData];
        }
        setMeetings(allMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    }

    if (selectedScheduleId === "") {
      fetchAllMeetings();
    }
  }, [selectedScheduleId, schedules]);

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
        {/* Main content column */}
        <div
          className="col px-2 py-2"
          style={{ paddingLeft: 0, margin: "1rem" }}
        >
          <div className="header-container">
            <h1>Archived Meetings</h1>
            <span className="position-absolute">
              <select
                id="archive-viewSelect"
                onChange={handleScheduleChange}
                style={{ transform: "translate(30rem, 0px)" }}
              >
                <option value="" selected="">
                  Select Schedule
                </option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.name}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <table className="table table-hover">
            <thead className="thead-light">
              <tr className="table-dark">
                <th scope="col">Contact</th>
                <th scope="col">Date</th>
                <th scope="col">Meeting</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>{getContactName(meeting.invitee)}</td>
                  <td>{meeting.date}</td>
                  <td>{meeting.title}</td>
                  <td style={{ color: " #5fad74" }}>{"Finished"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}

export default ArchivedMeetings;
