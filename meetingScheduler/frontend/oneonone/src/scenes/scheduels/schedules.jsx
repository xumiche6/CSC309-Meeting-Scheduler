import React, { useState, useEffect } from "react";
import "./style.css";
import {
  generateWeeklyCalendar,
  goToToday,
  navigate,
  generateWeeklyHeader,
  togglePopup,
  closePopup,
  showSchedule,
  showScheduleList,
  generateMonthlyCalendar,
  generateMonthlyHeader,
} from "./utils";
import {
  fetchMeetings,
  fetchSchedules,
  updateMeetingConfirmation,
  fetchContacts,
} from "./queries";
import NavBar from "../navBar/navBar";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../constants";

function Schedules() {
  const [view, setView] = useState("weekly");
  const [schedules, setSchedules] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const [selectedPendingMeetings, setSelectedPendingMeetings] = useState([]);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    async function fetchContactsData() {
      try {
        const contactsData = await fetchContacts(); // Fetch contacts
        console.log("contactsData", contactsData);
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
    return contacts[contactId] || "Terry Helix";
  };

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedPendingMeetings((prevMeetings) => [...prevMeetings, meeting]);
  };

  useEffect(() => {
    const getSchedules = async () => {
      const fetchedSchedules = await fetchSchedules();
      const nonArchivedSchedules = fetchedSchedules.filter(
        (schedule) => !schedule.isArchived,
      );
      setSchedules(nonArchivedSchedules);
      // Initially select all schedules
      setSelectedScheduleIds(
        nonArchivedSchedules.map((schedule) => schedule.id),
      );
    };

    getSchedules();
  }, []);

  const handleSelectSchedule = (scheduleId) => {
    if (selectedScheduleIds.includes(scheduleId)) {
      setSelectedScheduleIds(
        selectedScheduleIds.filter((id) => id !== scheduleId),
      );
    } else {
      setSelectedScheduleIds([...selectedScheduleIds, scheduleId]);
    }
  };

  useEffect(() => {
    const fetchSelectedMeetings = async () => {
      const selectedMeetings = await Promise.all(
        selectedScheduleIds.map(async (scheduleId) => {
          const meetings = await fetchMeetings(scheduleId);
          return meetings;
        }),
      );
      setMeetings(selectedMeetings.flat());
    };

    fetchSelectedMeetings();
  }, [selectedScheduleIds]);

  const header = document.getElementById("header-container");

  useEffect(() => {
    console.log(
      "meetings confired",
      meetings.filter((meeting) => meeting.confirmed),
    );
    switch (view) {
      case "weekly":
        generateWeeklyCalendar(
          new Date(),
          meetings.filter((meeting) => meeting.confirmed),
          getContactName,
        );
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay());
        let headerTitle = document.getElementById("headerTitle");
        headerTitle.textContent = generateWeeklyHeader(startDate);
        document.getElementById("btn-today").style.display = "flex";
        break;
      case "monthly":
        let headerMonthlyTitle = document.getElementById("headerTitle");
        headerMonthlyTitle.textContent = generateMonthlyHeader(
          new Date().getFullYear(),
          new Date().getMonth(),
        );
        generateMonthlyCalendar(
          new Date().getMonth(),
          new Date().getFullYear(),
          meetings.filter((meeting) => meeting.confirmed),
          getContactName,
        );

        // Hide the Today button
        document.getElementById("btn-today").style.display = "none";
        break;
      default:
        break;
    }
  }, [view, meetings]);

  const handleGoToTodayClick = async () => {
    const meetingShowed = meetings.filter(
      (meeting) => meeting.confirmed === true,
    );
    goToToday(meetingShowed, getContactName);
  };

  const handleNavButtonClick = async (direction) => {
    navigate(direction, meetings, getContactName);
  };

  useEffect(() => {
    const generateRecurringMeetings = async () => {
      const recurringMeetings = [];
      for (const scheduleId of selectedScheduleIds) {
        const fetchedMeetings = await fetchMeetings(scheduleId);
        const fetchedSchedules = await fetchSchedules();
        const selectedScheduleMeetings = fetchedMeetings.filter(
          (meeting) =>
            meeting.corresponding_schedule === scheduleId &&
            meeting.confirmed === true,
        );
        const scheduleDurationWeeks =
          fetchedSchedules[scheduleId - 1]?.duration_weeks;
        selectedScheduleMeetings.forEach((meeting) => {
          recurringMeetings.push(meeting);
          const startDate = new Date(meeting.date);
          for (let i = 0; i < scheduleDurationWeeks; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i * 7);
            const addedMeeting = {
              ...meeting,
              confirmed: true,
              date: newDate.toISOString().split("T")[0],
            };
            recurringMeetings.push({ ...addedMeeting });
          }
        });
      }
      setMeetings(recurringMeetings);
    };

    generateRecurringMeetings();
  }, [selectedScheduleIds]);

  const handleViewChange = (event) => {
    setView(event.target.value); // Update view state with selected value
  };

  const handleClosePopUp = () => {
    closePopup("false", selectedPendingMeetings);
  };

  const handleOpenConfirmationDialog = () => {
    openConfirmationDialog();
  };
  const handleConfirmCalendar = async () => {
    const meetingIds = selectedPendingMeetings.map((meeting) => meeting.id);
    await Promise.all(
      meetingIds.map(async (meetingId) => {
        await updateMeetingConfirmation(meetingId);
      }),
    );

    const updatedMeetings = await fetchMeetings(selectedScheduleIds);
    console.log("Updated meetings after confirmation:", updatedMeetings);

    // Generate recurring meetings for newly confirmed meetings
    const recurringMeetings = [];
    for (const updatedMeeting of updatedMeetings) {
      let i = 0;
      if (updatedMeeting.confirmed) {
        const scheduleId = updatedMeeting.corresponding_schedule;
        console.log("scheduleId", scheduleId);
        const fetchedSchedules = await fetchSchedules();
        const scheduleDurationWeeks = fetchedSchedules[i]?.duration_weeks;
        const startDate = new Date(updatedMeeting.date);

        for (let i = 1; i < scheduleDurationWeeks; i++) {
          const newDate = new Date(startDate);
          newDate.setDate(startDate.getDate() + i * 7);
          const recurringMeetingId = `${updatedMeeting.id}_recurring_${i}`;
          const addedMeeting = {
            ...updatedMeeting,
            date: newDate.toISOString().split("T")[0],
          };
          recurringMeetings.push(addedMeeting);
          // Call the endpoint to add the recurring meeting to database to store
          const response = await axios.post(
            `${API_URL}schedules/${scheduleId}/meetings/add/`,
            {
              ...updatedMeeting,
              date: newDate.toISOString().split("T")[0],
            },
          );
          if (response.ok) {
            console.log(
              `Added meeting with ID ${recurringMeetingId} successfully.`,
            );
          } else {
            console.error(
              `Failed to add meeting with ID ${recurringMeetingId}.`,
            );
          }
        }
      }
      i++;
    }

    const updatedMeetingsWithRecurring = [
      ...updatedMeetings,
      ...recurringMeetings,
    ];

    setMeetings(updatedMeetingsWithRecurring);

    // Close the popup
    closePopup("true");
    setConfirmationDialogOpen(false);

    // Call function to send auto emails
    sendAutoEmails();
  };

  const sendAutoEmails = () => {
    window.alert(
      "This meeting is finalized and the notification email has been sent to invitees.",
    );
  };

  const navigateFunction = useNavigate();

  const handleSuggestedScheduleButtonClick = () => {
    navigateFunction("/suggested-schedules");
  };

  console.log("meeting to generate", meetings);

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
          className="col-10 py-2"
          style={{ paddingLeft: 0 }}
          id={"schedule-container"}
        >
          <div className="header-container">
            <button
              id="btn-today"
              className="btn btn-today"
              onClick={handleGoToTodayClick}
            >
              Today
            </button>
            <div className="nav-buttons">
              <button
                id="previous-button"
                className="btn btn-primary"
                onClick={() => handleNavButtonClick("previous")}
              >
                {"<"}
              </button>
              <button
                id="next-button"
                className="btn btn-primary"
                onClick={() => handleNavButtonClick("next")}
              >
                {">"}
              </button>
            </div>
            <div className="header-title" id="headerTitle"></div>
            <select id="viewSelect" value={view} onChange={handleViewChange}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              {/*<option value="daily">Daily</option>*/}
            </select>
            <div id="btn-add-meeting-container">
              <button
                id="btn-add"
                className="btn btn-add-meeting"
                onClick={togglePopup}
              >
                Finalize Pending Meetings
              </button>
            </div>
          </div>
          <div id="page-wrapper" className="page-wrapper">
            <div id="schedule-filter" className="schedule-filter">
              <div id={"select-schedules-title"}>Select Schedules:</div>
              <div id="phaseFilter">
                {/* Map through schedules and generate checkboxes */}
                {schedules.map((schedule, index) => (
                  <div className="check-box-container" key={index}>
                    <input
                      type="checkbox"
                      id={schedule.id}
                      name="scheduleCheckbox"
                      value={schedule.name}
                      checked={selectedScheduleIds.includes(schedule.id)}
                      onChange={() => handleSelectSchedule(schedule.id)}
                    />
                    <label htmlFor={schedule.id}>{schedule.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div id="sub-page">
              <div id="calendar-container" className="table-responsive">
                <table className="table table-bordered mt-3">
                  <thead className="thead-light">
                    <tr id="daysOfWeekRow"></tr>
                  </thead>
                  <tbody id="calendar-body"></tbody>
                </table>
              </div>
              <div id="popupContainer" className="popup-container">
                <div className="pop-up-button-group">
                  <div id="confirmButtonContainer">
                    <button
                      className="btn"
                      id="confirmButton"
                      onClick={handleOpenConfirmationDialog}
                    >
                      Confirm
                    </button>
                    <a
                      className="btn"
                      id="suggestedScheduleButton"
                      onClick={handleSuggestedScheduleButtonClick}
                    >
                      See Suggested Schedule
                    </a>
                  </div>
                  <div
                    id="backButton"
                    style={{ display: "none" }}
                    onClick={showScheduleList}
                  >
                    <button>Back</button>
                  </div>
                  <button id="closePopup" onClick={handleClosePopUp}>
                    x
                  </button>
                </div>
                <p id="customized-calendar-instruction">Select a schedule</p>
                <div>
                  {schedules.map((schedule, index) => (
                    <p key={index}>
                      <a
                        href="#"
                        onClick={() =>
                          showSchedule(
                            schedule.id,
                            handleSelectMeeting,
                            getContactName,
                          )
                        }
                      >
                        {schedule.name}
                      </a>
                    </p>
                  ))}
                </div>
                <div id="popupContent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmationDialogOpen && (
        <div className="confirmation-dialog">
          <p>
            Do you confirm your current calendar? Once confirmed, the meeting
            will be finalized, and auto emails will be sent to invitees.
          </p>
          <button onClick={handleConfirmCalendar}>Yes, Confirm</button>
          <button onClick={closeConfirmationDialog}>Cancel</button>
        </div>
      )}
    </Container>
  );
}

export default Schedules;
