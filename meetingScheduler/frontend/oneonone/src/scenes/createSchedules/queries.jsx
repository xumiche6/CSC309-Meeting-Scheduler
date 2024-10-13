import axios from "axios";
import { API_URL } from "../../constants";

export const fetchContacts = async () => {
  try {
    const response = await axios.get(`${API_URL}contacts/list/`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

export const createSchedule = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}schedules/add/`, formData, {});
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};
