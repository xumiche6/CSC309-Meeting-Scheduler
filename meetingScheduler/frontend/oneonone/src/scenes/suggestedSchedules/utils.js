import React, { useEffect, useState } from "react";
import "./style.css";
import { generateWeeklyCalendarSuggestedSchedule } from "../scheduels/utils";
import { fetchContacts } from "./queries";
import { fetchSchedules } from "./queries";
import { convertToAbbreviation } from "../availabilities/utils";

export function convertTo24HourFormat(time12h, period) {
  const [hour, minutes] = time12h.match(/\d+/g);
  const isPM = period.toUpperCase() === "PM";
  let hours = parseInt(hour, 10);

  if (isPM && hours !== 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

function extractFieldsForMeetingAdd(meeting) {
  const { day, time, duration, title } = meeting;
  return { day, time, duration, title };
}

export function RenderListView({ suggestedMeetings }) {
  const [contacts, setContacts] = useState({});

  const getContactName = (contactId) => {
    return contacts[contactId] || "Loading...";
  };

  useEffect(() => {
    async function fetchContactsData() {
      try {
        const contactsData = await fetchContacts(); // Fetch contacts
        const contactsMap = contactsData.reduce((acc, contact) => {
          acc[contact.id] = contact.name;
          return acc;
        }, {});
        console.log("contactsMap", contactsMap);
        setContacts(contactsMap);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
    fetchContactsData();
  }, []);
  return (
    <table className="table table-hover">
      <thead>
        <tr className="table-dark" style={{ textAlign: "center" }}>
          <th scope="col">Contact</th>
          {/*<th scope="col">Schedule</th>*/}
          <th scope="col">Schedule</th>
          <th scope="col">Day</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {suggestedMeetings.map((meeting, index) => (
          <tr key={index} className={meeting.tableClass}>
            <td>{getContactName(meeting.invitee)}</td>
            <td>{meeting.schedule}</td>
            <td>{meeting.day}</td>
            <td>{meeting.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RenderCalendarView({ suggestedMeetings }) {
  const [contacts, setContacts] = useState({});

  const getContactName = (contactId) => {
    return contacts[contactId] || "Loading...";
  };

  useEffect(() => {
    async function fetchContactsData() {
      try {
        const contactsData = await fetchContacts(); // Fetch contacts
        const contactsMap = contactsData.reduce((acc, contact) => {
          acc[contact.id] = contact.name;
          return acc;
        }, {});
        setContacts(contactsMap);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }
    fetchContactsData();
  }, []);

  useEffect(() => {
    console.log("sample", suggestedMeetings);
    generateWeeklyCalendarSuggestedSchedule(
      new Date(),
      suggestedMeetings,
      getContactName,
    );
  }, [suggestedMeetings, getContactName]);

  return null;
}

function calculateDuration(time) {
  const [startTime, endTime] = time.split("-");
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes - startMinutes;
}

// Function to convert original data to new data
export const convertData = async (originalData) => {
  try {
    // Extract relevant information from original data
    const { invitee, schedule, day, time } = originalData;
    const [startTime, endTime] = time.split("-");

    // Fetch schedule information
    const schedules = await fetchSchedules();
    const contacts = await fetchContacts();

    // Find the corresponding schedule in the fetched data
    const matchingSchedule = schedules.find((s) => s.name === schedule);

    const matchingContact = contacts.find((c) => c.id === invitee);

    if (!matchingSchedule) {
      console.error(`Schedule '${schedule}' not found.`);
      return null;
    }

    const dayAbbreviation = convertToAbbreviation(day);

    // Convert the day abbreviation to its corresponding numeric value (0 for Sunday, 1 for Monday, etc.)
    const dayValue = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
      dayAbbreviation,
    );

    // Parse the start date of the matching schedule
    const startDate = new Date(matchingSchedule.start_date);

    // Calculate the difference in days between the start date's day of the week and the desired day of the week
    const dayDiff = dayValue - startDate.getDay();

    // Create a new Date object by adding the difference in days to the start date
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + dayDiff - 1);

    // Format the new date as YYYY-MM-DD
    const formattedDate = newDate.toISOString().split("T")[0];
    // Assemble the new data
    const newData = {
      inviter: invitee,
      day: dayAbbreviation,
      time: startTime,
      title: schedule,
      corresponding_schedule: matchingSchedule.id,
      duration: calculateDuration(time),
      isInviteeResponseReceived: true,
      confirmed: false,
      date: formattedDate, // Assuming start_date is available in the schedule data
      invitee: matchingContact.id,
      color: matchingSchedule.color,
    };
    return newData;
  } catch (error) {
    console.error("Error converting data:", error);
    return null;
  }
};

// Function to convert a list of original meeting data to the new format
export const convertAllData = async (originalDataList) => {
  try {
    const newDataList = [];

    // Iterate over each original meeting data
    for (const originalData of originalDataList) {
      // Convert the current meeting data
      const newData = await convertData(originalData);
      if (newData) {
        // If conversion was successful, add the new data to the list
        newDataList.push(newData);
      }
    }
    return newDataList;
  } catch (error) {
    console.error("Error converting data:", error);
    return [];
  }
};

export const getFullDayName = (abbreviatedDay) => {
  const daysMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return daysMap[abbreviatedDay] || abbreviatedDay;
};

export const convertTo12HourFormat = (timeString) => {
  const date = new Date(`2000-01-01T${timeString}`);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${amOrPm}`;
};

export function convertToNonLeadingZeroTime(timeString) {
  const [hourStr, minuteStr, meridiem] = timeString.split(/[:\s]+/);

  let hour = parseInt(hourStr, 10);
  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${minuteStr} ${meridiem}`;
}

export function convertOverlappingTime(originalData) {
  const convertedData = { overlappingtime: {} };

  for (const option in originalData.overlapping_time) {
    convertedData.overlappingtime[option] = [];

    originalData.overlapping_time[option].forEach((entry) => {
      for (const invitee in entry) {
        const entryParts = entry[invitee].split(" ");

        const day = entryParts[0];
        const startTime = entryParts[1];
        const timeRange = entryParts[2].split("-"); // Split time range into start and end times
        const endTime = timeRange[1];
        const period = entryParts[3];
        const schedule = entryParts[4];
        const inviteeNumber = invitee.slice(-1); // Extract the invitee number

        convertedData.overlappingtime[option].push({
          invitee: parseInt(inviteeNumber),
          schedule: schedule,
          day: day,
          time: convertTo24HourFormats(`${startTime}-${endTime} ${period}`),
        });
      }
    });
  }

  return convertedData;
}

function convertTo24HourFormats(time12h) {
  const parts = time12h.split("-");
  const [start, end] = parts.map((time) => {
    const [hour, minutes] = time.split(":").map((part) => parseInt(part));
    const isPM = /pm/i.test(time12h);
    let hours = hour;

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  });

  return `${start}-${end}`;
}
