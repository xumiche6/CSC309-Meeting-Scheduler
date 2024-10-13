import React, { useState, useEffect } from "react";
import "./style.css";
import { createSchedule, fetchContacts } from "./queries";
import Select from "react-select";
import NavBar from "../navBar/navBar";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateSchedules() {
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [scheduleName, setScheduleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [nameError, setNameError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [durationWeeksError, setDurationWeeksError] = useState("");
  const navigate = useNavigate();

  const handleContactSelection = (selectedOptions) => {
    setSelectedContacts(selectedOptions);
  };

  // Validate schedule name
  useEffect(() => {
    const nameRegex = /^(?!\s*$)[a-zA-Z0-9\s_]{3,}$/;
    setNameError(
      scheduleName === ""
        ? ""
        : nameRegex.test(scheduleName)
          ? ""
          : "Username is invalid",
    );
  }, [scheduleName]);

  // Validate start date
  useEffect(() => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    setStartDateError(
      startDate === ""
        ? ""
        : dateRegex.test(startDate)
          ? ""
          : "Please enter a valid date format (yyyy-mm-dd)",
    );
  }, [startDate]);

  // Validate duration weeks
  useEffect(() => {
    const durationRegex = /^\d+$/;
    setDurationWeeksError(
      durationWeeks === ""
        ? ""
        : durationRegex.test(durationWeeks)
          ? ""
          : "Duration weeks is not valid",
    );
  }, [durationWeeks]);

  // Function to submit the form
  async function submitForm(e) {
    e.preventDefault();

    if (!nameError && !startDateError && !durationWeeksError) {
      const invitedContacts = selectedContacts.map((contact) => contact.value);

      const requestData = {
        invited_contacts: invitedContacts,
        meetings: [],
        duration_weeks: durationWeeks,
        name: scheduleName,
        start_date: startDate,
      };

      try {
        await createSchedule(requestData);
        setSuccessMessage("Schedule has been successfully created!");
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } catch (error) {
        console.error("Error creating schedule:", error);
      }
    }
  }

  const handleNavigate = () => {
    navigate("/schedules");
  };

  // Fetch contacts when the component mounts
  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const contactsData = await fetchContacts();
        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContactsData();
  }, []);

  return (
    <Container fluid className="px-0">
      <div className="row" style={{ height: "100vh", overflowY: "hidden" }}>
        {/* Main content column */}
        <div
          className="col px-2 py-2"
          style={{ paddingLeft: 0, margin: "1rem" }}
        >
          <div className="create-schedule-header-container">
            <h1>Create New Schedule</h1>
            <button
              id="button-redirect"
              onClick={handleNavigate}
              className={"redirect-button"}
            >
              Go Back to Schedules Page
            </button>
          </div>
          <form onSubmit={submitForm}>
            <label htmlFor="scheduleName">Schedule Name:</label>
            <input
              className={nameError ? "error-input" : ""}
              type="text"
              id="scheduleName"
              name="scheduleName"
              required
              onChange={(e) => setScheduleName(e.target.value)}
              value={scheduleName}
            />
            {nameError && <span className="error">{nameError}</span>}
            <br />

            <label htmlFor="startDate">Start Date:</label>
            <input
              className={startDateError ? "error-input" : ""}
              type="text"
              id="startDate"
              name="startDate"
              placeholder="e.g., 2024-01-03"
              required
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            {startDateError && <span className="error">{startDateError}</span>}
            <br />

            <label htmlFor="durationWeeks">Duration (weeks):</label>
            <input
              className={durationWeeksError ? "error-input" : ""}
              type="text"
              id="durationWeeks"
              name="durationWeeks"
              placeholder="e.g., 2"
              required
              onChange={(e) => setDurationWeeks(e.target.value)}
              value={durationWeeks}
            />
            {durationWeeksError && (
              <span className="error">{durationWeeksError}</span>
            )}
            <br />

            <label htmlFor="contacts">Select contacts:</label>
            <Select
              options={contacts.map((contact) => ({
                value: contact.id,
                label: `${contact.name} (${contact.email})`,
              }))}
              isMulti
              value={selectedContacts}
              onChange={handleContactSelection}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
            <input type="submit" value="Submit" style={{ marginTop: "1rem" }} />
          </form>
          <div id="successMessage" className="success">
            {successMessage}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CreateSchedules;
