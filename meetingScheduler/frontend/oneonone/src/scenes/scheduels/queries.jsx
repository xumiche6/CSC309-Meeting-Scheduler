import axios from "axios";
import { API_URL } from "../../constants";
// Function to fetch schedules
export const fetchSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}schedules/all/`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

// Function to fetch all meetings for a schedule
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

export const fetchContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}contacts/list/`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};
