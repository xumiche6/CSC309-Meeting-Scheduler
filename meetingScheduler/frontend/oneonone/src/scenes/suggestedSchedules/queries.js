import axios from "axios";
import { API_URL } from "../../constants";

// Function to fetch schedules
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNDI5ODAyLCJpYXQiOjE3MTI0Mjk1MDIsImp0aSI6ImRlMmM5YmY4M2U2MTQ1YTRiYjllOGI3NTIyYzgwY2NjIiwidXNlcl9pZCI6MX0.nDyk-9HSDy_9mUnTHMCFZw4XSpKYXZPeuQqnpdXvX7o";
export const fetchSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}schedules/all/`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export const fetchContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}contacts/list/`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export const updateMeetingConfirmation = async (meetingId) => {
  try {
    const response = await axios.patch(
      `${API_URL}schedules/meeting/${meetingId}/update_confirmation/`,
      { confirmed: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data) {
      console.error(
        `Failed to update meeting ${meetingId} confirmation status.`,
      );
    }
  } catch (error) {
    console.error(
      `Error updating meeting ${meetingId} confirmation status:`,
      error,
    );
  }
};

export const updateMeetingInviteeResponse = async (meetingId) => {
  try {
    const response = await axios.patch(
      `${API_URL}schedules/meeting/${meetingId}/update_invitee_response/`,
      { isInviteeResponseReceived: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data) {
      console.error(
        `Failed to update meeting ${meetingId} isInviteeResponseReceived status.`,
      );
    }
  } catch (error) {
    console.error(
      `Error updating meeting ${meetingId} isInviteeResponseReceived status:`,
      error,
    );
  }
};

// add the overlapping meetings to the database
export const addMeetingsToSchedule = async (meetings) => {
  try {
    const responses = []; // Array to store responses for each meeting

    for (const meeting of meetings) {
      console.log("meeting in meetings", meeting);
      const {
        day,
        time,
        title,
        duration,
        corresponding_schedule,
        inviter,
        date,
      } = meeting;

      const requestData = {
        day: day,
        time: time,
        title: title,
        duration: duration,
        isInviteeResponseReceived: true,
        corresponding_schedule: corresponding_schedule,
        inviter: inviter,
        date: date,
      };

      // Make a POST request to the MeetingCreateView endpoint
      const response = await axios.post(
        `${API_URL}schedules/${corresponding_schedule}/meetings/add/`,
        requestData,
        {},
      );
      console.log("response", response.data);
      // Push the response to the array
      responses.push(response.data);
    }

    // Return the array of responses after all requests are completed
    console.log("responses", responses);
    return responses;
  } catch (error) {
    // Handle any errors
    console.error("Error adding meetings:", error);
    return []; // Return an empty array in case of error
  }
};

export const fetchMeetings = async (scheduleId) => {
  try {
    const response = await axios.get(
      `${API_URL}schedules/${scheduleId}/meetings/all/`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
};
