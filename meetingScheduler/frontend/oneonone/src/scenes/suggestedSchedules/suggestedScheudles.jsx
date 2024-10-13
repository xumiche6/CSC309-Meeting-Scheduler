import React, { useEffect, useState } from "react";
import "./style.css";
import {
  convertAllData,
  convertOverlappingTime,
  convertTo12HourFormat,
  convertToNonLeadingZeroTime,
  getFullDayName,
  RenderCalendarView,
  RenderListView,
} from "./utils";
import NavBar from "../navBar/navBar";
import { useNavigate } from "react-router-dom";
import {
  addMeetingsToSchedule,
  fetchMeetings,
  updateMeetingConfirmation,
  updateMeetingInviteeResponse,
} from "./queries";
import axios from "axios";
import { API_URL } from "../../constants";
import { formatAvailabilities } from "../receiverAvail/utils";
import { Container } from "react-bootstrap";

function SuggestedSchedules() {
  const [suggestedMeetings1, setSuggestedMeetings1] = useState([]);
  const [suggestedMeetings2, setSuggestedMeetings2] = useState([]);

  const [calendarSuggestedMeetings1, setCalendarSuggestedMeetings1] = useState(
    [],
  );
  const [calendarSuggestedMeetings2, setCalendarSuggestedMeetings2] = useState(
    [],
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch schedule list
        const scheduelList = await axios.get(`${API_URL}schedules/all/`, {});
        console.log("scheduelList", scheduelList);
        // Fetch receiver availability data
        const receiverResponse = await axios.get(
          `${API_URL}receiver_avail/overview/`,
        );
        const receiverAvail = receiverResponse.data;

        const formattedReceiverAvail = formatAvailabilities(
          receiverAvail,
          scheduelList.data,
        );

        // replace the undefine at the top level with "invitees_availabilities"
        const newReceiverAvail = {
          invitees_availabilities: formattedReceiverAvail,
        };

        for (const phase in newReceiverAvail.invitees_availabilities) {
          for (const inviteeId in newReceiverAvail.invitees_availabilities[
            phase
          ]) {
            newReceiverAvail.invitees_availabilities[phase][inviteeId] =
              newReceiverAvail.invitees_availabilities[phase][inviteeId].map(
                ({ day, start_time, duration }) => ({
                  day,
                  start_time: convertToNonLeadingZeroTime(start_time),
                  duration,
                }),
              );
          }
        }

        // Fetch sender availability data
        const senderResponse = await axios.get(
          `${API_URL}sender/availability/list/`,
        );
        const senderAvail = senderResponse.data;
        const extractedSenderAvail = senderAvail.map(
          ({ day, duration, start_time, priority }) => ({
            day: getFullDayName(day),
            duration,
            start_time: convertTo12HourFormat(start_time),
            priority,
          }),
        );

        // Call the recommendedSchedules endpoint with senderAvail and extractedAvail as request data
        const recommendedResponse = await axios.post(
          `${API_URL}recommendedSchedules/`,
          {
            sender_availabilities: extractedSenderAvail,
            invitees_availabilities: newReceiverAvail.invitees_availabilities,
          },
        );
        if (
          typeof recommendedResponse.data.overlapping_time === "object" &&
          Object.keys(recommendedResponse.data.overlapping_time).length === 0
        ) {
          window.alert(
            "Your availability does not overlap with that of the invitee. You may wish to adjust your schedule or reach out to the invitee directly to coordinate.",
          );
          navigate("/schedules");
        }

        const convertedRecommendedResponse = convertOverlappingTime(
          recommendedResponse.data,
        );

        setSuggestedMeetings1(
          convertedRecommendedResponse.overlappingtime["option1"],
        );
        setSuggestedMeetings2(
          convertedRecommendedResponse.overlappingtime["option2"],
        );

        const result1 = await getCalendarSuggestedMeetings(
          convertedRecommendedResponse.overlappingtime["option1"],
        );

        const result2 = await getCalendarSuggestedMeetings(
          convertedRecommendedResponse.overlappingtime["option2"],
        );
        setCalendarSuggestedMeetings1(result1);
        setCalendarSuggestedMeetings2(result2);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  async function getCalendarSuggestedMeetings(meetings) {
    try {
      const result = await convertAllData(meetings);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  const [selectedSchedule, setSelectedSchedule] = useState("option1");
  const [_showListView, setShowListView] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(true);
  const navigate = useNavigate();

  const handleScheduleChange = (event) => {
    setSelectedSchedule(event.target.value);
  };

  const handleCalendarViewClick = () => {
    setShowListView(false);
    setShowCalendarView(true);
    document.getElementById("choose-schedule").style.display = "flex";
  };

  const handleListViewClick = () => {
    setShowCalendarView(false);
    setShowListView(true);
    document.getElementById("choose-schedule").style.display = "none";
  };

  const handleConfirmCalendar = async (meetingId) => {
    await updateMeetingConfirmation(meetingId);
    await updateMeetingInviteeResponse(meetingId);
  };

  const confirmAllMeetings = async () => {
    try {
      const meetingsToAdd =
        selectedSchedule === "option1"
          ? calendarSuggestedMeetings1
          : calendarSuggestedMeetings2;
      // Update confirmation status for each meeting
      console.log(meetingsToAdd);
      await addMeetingsToSchedule(meetingsToAdd);
      const uniqueScheduleIds = [
        ...new Set(
          meetingsToAdd.map((meeting) => meeting.corresponding_schedule),
        ),
      ];
      const totalMeetings = [];
      for (const scheduleId of uniqueScheduleIds) {
        const meetings = await fetchMeetings(scheduleId);
        totalMeetings.push(...meetings);
      }
      console.log("meetingsToAdd", meetingsToAdd);
      console.log("totalMeetings", totalMeetings);
      const addedMeetings = totalMeetings.filter((meeting) =>
        meetingsToAdd.some(
          (addedMeeting) =>
            meeting.day === addedMeeting.day &&
            meeting.time.slice(0, 5) === addedMeeting.time.slice(0, 5) &&
            meeting.title === addedMeeting.title,
        ),
      );
      const meetingIds = addedMeetings.map((meeting) => meeting.id);
      await Promise.all(
        meetingIds.map(async (meetingId) => {
          await handleConfirmCalendar(meetingId);
        }),
      );
    } catch (error) {
      console.error("Error choosing this suggested schedules:", error);
    }
  };
  const handleConfirm = async () => {
    await confirmAllMeetings();
    navigate("/schedules");
  };

  return (
    <Container fluid className="px-0">
      <div className="row" style={{ height: "100vh", overflowY: "hidden" }}>
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
          <div className="header-container">
            <h1>Suggested Schedules</h1>
            <div className="container mt-3">
              <div className="row">
                <div className="col-12">
                  <h6>Choose a selected schedule:</h6>
                  <select
                    className="form-select"
                    defaultValue="option1"
                    value={selectedSchedule}
                    onChange={handleScheduleChange}
                  >
                    <option value="option1">Schedule 1</option>
                    <option value="option2">Schedule 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div style={{ margin: "3rem", alignContent: "center" }}>
            <div className="button-container">
              <button
                className="btn btn-secondary me-2"
                type="button"
                onClick={handleCalendarViewClick}
              >
                Calendar View
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleListViewClick}
              >
                List View
              </button>
            </div>
            {showCalendarView && (
              <div
                id="suggested-calendar-container"
                className="table-responsive"
                style={{ marginLeft: "-0.1rem" }}
              >
                <table className="table table-bordered mt-3">
                  <thead className="thead-light">
                    <tr id="daysOfWeekRow"></tr>
                  </thead>
                  <tbody id="calendar-body"></tbody>
                </table>
              </div>
            )}
            {showCalendarView ? (
              <RenderCalendarView
                suggestedMeetings={
                  selectedSchedule === "option1"
                    ? calendarSuggestedMeetings1
                    : calendarSuggestedMeetings2
                }
              />
            ) : (
              <RenderListView
                suggestedMeetings={
                  selectedSchedule === "option1"
                    ? suggestedMeetings1
                    : suggestedMeetings2
                }
              />
            )}
            <div className="row px-2">
              <p style={{ color: "#c7362c" }}>
                WARNING: There are contacts in this meeting who have not
                confirmed their availability yet!
              </p>
            </div>
            <div className="row px-2">
              <button
                className="btn btn-primary align-items-center"
                type="button"
                onClick={handleConfirm}
                id={"choose-schedule"}
                // style={{ marginLeft: "-0.1rem" }}
              >
                Choose this schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SuggestedSchedules;
