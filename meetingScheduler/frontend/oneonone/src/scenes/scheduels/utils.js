import { fetchMeetings } from "./queries";

// Initial Load
let currentDate = new Date();

// (1) Initial value
let timesOfDay = Array.from({ length: 24 }, (_, i) => i + 1);
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function generateWeeklyCalendarSuggestedSchedule(
  startDate,
  confirmedMeeting,
  getContactName,
) {
  console.log("confirmedMeeting", confirmedMeeting);
  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let timesOfDay = Array.from({ length: 24 }, (_, i) => i + 1);

  let daysOfWeekRow = document.getElementById("daysOfWeekRow");
  let calendarBody = document.getElementById("calendar-body");

  daysOfWeekRow.innerHTML = "";
  calendarBody.innerHTML = "";

  // Create one empty cell for the time column header and display time zone at the cell at (0,0)
  let timeZone = document.createElement("th");
  timeZone.innerHTML = `<div class="time-zone-cell">EST</div>`;
  daysOfWeekRow.appendChild(timeZone);
  startDate = new Date(startDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Create days of the week headers with dates
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    let th = document.createElement("th");
    let date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOfWeek);

    let isToday = isDateToday(date);

    th.innerHTML = `<div class="${isToday ? "today" : ""}">${
      daysOfWeek[dayOfWeek]
    }<br>${date.getDate()}</div>`;

    // Highlight today date
    if (isToday) {
      th.style.background = "#4169E1";
    }

    daysOfWeekRow.appendChild(th);
  }

  // Create time column and cells
  for (let time of timesOfDay) {
    let row = document.createElement("tr");

    // The Time column
    let timeCell = document.createElement("td");
    timeCell.textContent = formatTime(time);
    row.appendChild(timeCell);

    // The Day cells
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      let cell = document.createElement("td");
      cell.textContent = ""; // Empty cell

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
  // Iterate through the confirmed meetings and update the calendar
  confirmedMeeting.forEach((meeting) => {
    // Extract data from the meeting object
    let { date, day, time, duration, title, invitee, color } = meeting;
    // Format the time data
    let formattedTime = formatBackendTime(time, duration);

    // Call retrieveTimeToCalendar with formatted time data
    retrieveTimeToCalendarSuggestedSchedule(
      date,
      day,
      formattedTime,
      title,
      invitee,
      color,
      getContactName,
    );
  });
}

function retrieveTimeToCalendarSuggestedSchedule(
  date,
  day,
  time,
  title,
  invitee,
  color,
  getContactName,
) {
  let startHour = parseInt(time.split("-")[0]);
  let endHour = parseInt(time.split("-")[1]);
  let clock = time.split(" ")[1];
  let timeOfDay = `${startHour}${clock}`;
  console.log(timeOfDay);
  let startRow = timesOfDay.indexOf(convertTo24HourFormat(timeOfDay)) + 1; // Get the row index based on the start time
  let cellIndex = dayIndex(day);

  // check if the date matches the date in header
  let columnHeader = document.querySelector(
    `.table th:nth-child(${dayIndex(day) + 2})`,
  );

  // Extract the day number from the date string
  // Extract the day number from the date string

  // Check if the date matches the date in the header
  if (!columnHeader || !/\d+/.test(columnHeader.textContent)) {
    return;
  }

  const columnHeaderDayNumber = parseInt(
    columnHeader.textContent.match(/\d+/)[0],
  );

  if (startRow !== -1 && cellIndex !== -1) {
    let rowspan = endHour - startHour;
    let calendarTable = document.querySelector(".table");
    if (calendarTable) {
      for (let i = 0; i < rowspan; i++) {
        let currentRow = startRow + i;
        let row = calendarTable.querySelector(
          `#calendar-body tr:nth-child(${currentRow})`,
        );
        if (row) {
          let cell = row.querySelector(`td:nth-child(${cellIndex + 2})`);
          if (cell) {
            if (i === 0) {
              console.log("conflict?", checkConflict(cell, title, invitee));
              // Check for conflict
              if (checkConflict(cell, title, invitee)) {
                // Show a confirmation prompt for resolving the conflict
                window.alert(
                  `This time slot on ${day} at ${time} is already booked. Please reselect your choice.`,
                );
                // if (!confirmation) {
                //   return; // If the user cancels, exit and no changes will be made
                // }
                return;
              }
              cell.innerHTML = `<span style="display: block;">${title} with ${getContactName(invitee)}</span>`;
              cell.style.backgroundColor = color;
              cell.rowSpan = rowspan; // No increment on rowspan in the first cell
            } else {
              // For cells in the same row but not in the first column of rowspan
              cell.style.display = "none"; // Hide the cell
            }
          }
        }
      }
    }
  }
}
function getMonthAbbreviation(monthNumber) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Ensure monthNumber is within range
  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  } else {
    return "Invalid Month";
  }
}
export function generateWeeklyCalendar(
  startDate,
  confirmedMeeting,
  getContactName,
) {
  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let timesOfDay = Array.from({ length: 24 }, (_, i) => i + 1);

  let daysOfWeekRow = document.getElementById("daysOfWeekRow");
  let calendarBody = document.getElementById("calendar-body");

  daysOfWeekRow.innerHTML = "";
  calendarBody.innerHTML = "";

  // Create one empty cell for the time column header and display time zone at the cell at (0,0)
  let timeZone = document.createElement("th");
  timeZone.innerHTML = `<div class="time-zone-cell">EST</div>`;
  daysOfWeekRow.appendChild(timeZone);
  startDate = new Date(startDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Create days of the week headers with dates
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    let th = document.createElement("th");
    let date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOfWeek);

    let isToday = isDateToday(date);

    th.innerHTML = `<div class="${isToday ? "today" : ""}">${
      daysOfWeek[dayOfWeek]
    }<br>${date.getDate()}</div>`;

    // Highlight today date
    if (isToday) {
      th.style.background = "#4169E1";
    }

    daysOfWeekRow.appendChild(th);
  }

  // Create time column and cells
  for (let time of timesOfDay) {
    let row = document.createElement("tr");

    // The Time column
    let timeCell = document.createElement("td");
    timeCell.textContent = formatTime(time);
    row.appendChild(timeCell);

    // The Day cells
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      let cell = document.createElement("td");
      cell.textContent = ""; // Empty cell

      row.appendChild(cell);
    }

    calendarBody.appendChild(row);
  }
  const header = document.getElementById("headerTitle").textContent;
  // Iterate through the confirmed meetings and update the calendar
  confirmedMeeting.forEach((meeting) => {
    // Extract data from the meeting object
    let { date, day, time, duration, title, invitee, color } = meeting;

    // Get the month and year from the meeting's date
    const meetingMonth = date.substring(5, 7);
    const meetingYear = date.substring(0, 4);
    if (
      header.includes(getMonthAbbreviation(meetingMonth)) &&
      header.includes(meetingYear)
    ) {
      // Format the time data
      let formattedTime = formatBackendTime(time, duration);

      // Call retrieveTimeToCalendar with formatted time data
      retrieveTimeToCalendar(
        date,
        day,
        formattedTime,
        title,
        invitee,
        color,
        getContactName,
      );
    }
  });

  document.getElementById("btn-add-meeting-container").style.display = "flex";
}

// weekly -- retrieving confirmed meetings to display on calendars
// difference between addTimeToCalendar: not add it selectedTimeSlots list
function retrieveTimeToCalendar(
  date,
  day,
  time,
  title,
  invitee,
  color,
  getContactName,
) {
  let startHour = parseInt(time.split("-")[0]);
  let endHour = parseInt(time.split("-")[1]);
  let clock = time.split(" ")[1];
  let timeOfDay = `${startHour}${clock}`;
  console.log(timeOfDay);
  let startRow = timesOfDay.indexOf(convertTo24HourFormat(timeOfDay)) + 1; // Get the row index based on the start time
  let cellIndex = dayIndex(day);

  // check if the date matches the date in header
  let columnHeader = document.querySelector(
    `.table th:nth-child(${dayIndex(day) + 2})`,
  );

  // Extract the day number from the date string
  // Extract the day number from the date string
  let dayNumber = parseInt(date.split("-")[2]);
  console.log("day number new", dayNumber);
  // Check if the date matches the date in the header
  if (!columnHeader || !/\d+/.test(columnHeader.textContent)) {
    return;
  }

  const columnHeaderDayNumber = parseInt(
    columnHeader.textContent.match(/\d+/)[0],
  );
  console.log("columnHeaderDayNumber?", columnHeaderDayNumber);
  console.log("dayNumber", dayNumber);
  if (columnHeaderDayNumber !== dayNumber) {
    return;
  }
  if (startRow !== -1 && cellIndex !== -1) {
    let rowspan = endHour - startHour;
    let calendarTable = document.querySelector(".table");
    if (calendarTable) {
      for (let i = 0; i < rowspan; i++) {
        let currentRow = startRow + i;
        let row = calendarTable.querySelector(
          `#calendar-body tr:nth-child(${currentRow})`,
        );
        if (row) {
          let cell = row.querySelector(`td:nth-child(${cellIndex + 2})`);
          if (cell) {
            if (i === 0) {
              // Check for conflict
              // if (checkConflict(cell, title, invitee)) {
              //   // Show a confirmation prompt for resolving the conflict
              //   // let confirmation = confirm(
              //   //   `This time slot on ${day} at ${time} is already booked. Are you sure you want to assign this time slot to ${invitee}?`
              //   // );
              //   // if (!confirmation) {
              //   //   return; // If the user cancels, exit and no changes will be made
              //   // }
              //   return
              // }
              cell.innerHTML = `<span style="display: block;">${title} with ${getContactName(invitee)}</span>`;
              cell.style.backgroundColor = color;
              cell.rowSpan = rowspan; // No increment on rowspan in the first cell
            } else {
              // For cells in the same row but not in the first column of rowspan
              cell.style.display = "none"; // Hide the cell
            }
          }
        }
      }
    }
  }
}

function dayIndex(day) {
  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let index = daysOfWeek.indexOf(day);
  return index;
}

function isDateToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatTime(hour) {
  if (hour === 12) {
    return "12pm";
  } else if (hour > 11) {
    return hour - 12 + "pm";
  } else {
    return hour + "am";
  }
}

function convertTo24HourFormat(time12h) {
  const [hour] = time12h.match(/\d+/);
  const isPM = /pm/i.test(time12h);
  let hours = parseInt(hour, 10);

  if (isPM && hours !== 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0; // Convert 12:00:00 AM to 0
  }

  return hours === 0 ? 12 : hours; // Return 12 for 0
}

// Function to format time from backend data
function formatBackendTime(startTime, duration) {
  console.log(startTime);
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = startHour + Math.floor(duration / 60);
  const startMinutes = parseInt(startTime.split(":")[1]);
  const endMinutes = (startMinutes + duration) % 60;
  return (
    `${startHour}:${startMinutes < 10 ? "0" + startMinutes : startMinutes}-` +
    `${endHour}:${endMinutes < 10 ? "0" + endMinutes : endMinutes}`
  );
}

// Function to check for conflicts with existing content in a cell
function checkConflict(cell, title, invitee) {
  if (cell.innerHTML.trim() === "") {
    return false;
  }

  // Check if the cell content matches the information about to be added
  let cellContent = cell.textContent.trim();
  let expectedContent = `${title} with ${invitee}`;

  return cellContent !== expectedContent;
}

// (2) Header Action to return to today
export function goToToday(confirmedMeetings, getContactName) {
  let viewSelect = document.getElementById("viewSelect");
  let headerTitle = document.getElementById("headerTitle");

  switch (viewSelect.value) {
    case "weekly":
      let startDate = new Date();
      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from the first day of this week
      headerTitle.textContent = generateWeeklyHeader(startDate);
      generateWeeklyCalendar(startDate, confirmedMeetings, getContactName);
      updateHeaderTitle(headerTitle, startDate, endDate);
      break;
    default:
      break;
  }
}

export function generateWeeklyHeader(startDate) {
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  let startMonthYear = startDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  let endMonthYear = endDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  if (
    startMonthYear !== endMonthYear ||
    startDate.getMonth() !== endDate.getMonth()
  ) {
    return `${startMonthYear}-${endMonthYear}`;
  } else {
    return startMonthYear;
  }
}

function updateHeaderTitle(headerTitle, startDate, endDate) {
  let startMonth = startDate.toLocaleString("default", { month: "short" });
  let endMonth = endDate.toLocaleString("default", { month: "short" });

  // Update the header title with the new date range
  if (startMonth !== endMonth) {
    headerTitle.textContent = `${startMonth}-${endMonth} ${startDate.getFullYear()}`;
  } else {
    headerTitle.textContent = `${startMonth} ${startDate.getFullYear()}`;
  }
}

// (3) Navigate
export function navigate(direction, confirmedMeetings, getContactName) {
  let viewSelect = document.getElementById("viewSelect");
  let headerTitle = document.getElementById("headerTitle");

  switch (viewSelect.value) {
    case "weekly":
      navigateWeekly(direction, headerTitle, confirmedMeetings, getContactName);
      break;
    case "monthly":
      navigateMonthly(
        direction,
        headerTitle,
        confirmedMeetings,
        getContactName,
      );
      break;
    default:
      break;
  }
}

function navigateWeekly(
  direction,
  headerTitle,
  confirmedMeetings,
  getContactName,
) {
  if (direction === "previous") {
    currentDate.setDate(currentDate.getDate() - 7);
  } else if (direction === "next") {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  let endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + 6);

  // Fetch confirmed meetings for the new week
  // Calculate the start date of the week (typically Sunday)
  const newStartDate = new Date(currentDate);
  newStartDate.setDate(currentDate.getDate() - currentDate.getDay());

  // Increment end date by 1 to include the whole week
  const newEndDate = new Date(endDate);
  newEndDate.setDate(newEndDate.getDate() + 1);

  generateWeeklyCalendar(currentDate, confirmedMeetings, getContactName);

  // selectedPendingMeetings.forEach((meeting) => {
  //   console.log("select add", meeting)
  //   let {date, day, time, duration, title, invitee, color} = meeting;
  //   const newDate = new Date(date);
  //
  //   newDate.setDate(startDate.getDate() + (i * 7));
  //   let newDate = newDate.setDate(tempDate.getDate() + 7);
  //   addStagingTimeToCalendar(newDate.toISOString().split('T')[0], day, time, duration, title, invitee, color);
  // });

  let startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - currentDate.getDay());
  console.log("startdate", startDate);
  console.log("enddate", endDate);
  updateHeaderTitle(headerTitle, startDate, endDate);
}

function navigateMonthly(
  direction,
  headerTitle,
  confirmedMeetings,
  getContactName,
) {
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  if (direction === "previous") {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11; // Dec
      currentYear--;
    }
  } else if (direction === "next") {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0; // Jan
      currentYear++;
    }
  }

  currentDate.setMonth(currentMonth);
  currentDate.setFullYear(currentYear);

  headerTitle.textContent = generateMonthlyHeader(currentYear, currentMonth);

  try {
    if (currentMonth == new Date().getMonth()) {
      generateMonthlyCalendar(
        currentMonth,
        currentYear,
        confirmedMeetings,
        getContactName,
      );
    } else {
      generateMonthlyCalendar(
        currentMonth,
        currentYear,
        confirmedMeetings,
        getContactName,
      );
    }
  } catch (error) {
    console.error("Error generating monthly calendar:", error.message);
  }
}

// (4) Toggle and Close Pop Up Container

export function togglePopup() {
  showScheduleList();
  let popupContainer = document.getElementById("popupContainer");
  let calendarTable = document.querySelector(".table");

  // If the popup is hidden -- display it and reduce the calendar width
  if (
    popupContainer.style.display === "none" ||
    !popupContainer.style.display
  ) {
    popupContainer.style.display = "block";

    // Calculate the available width for the calendar to avoid overlap with the popup
    let popupWidth = 300;
    let scheduleFilterWidth =
      document.getElementById("schedule-filter").clientWidth;
    let pageWrapperWidth =
      document.getElementById("schedule-container").clientWidth;
    let availableWidth =
      pageWrapperWidth - popupWidth - scheduleFilterWidth + 100;

    calendarTable.style.transition = "all 0.5s ease";
    calendarTable.style.marginRight = popupWidth + "px";
    calendarTable.style.width = availableWidth - 30 + "px";
    calendarTable.style.overflowX = "auto";
  } else {
    // If the popup is shown, close it.
    const popupContainer = document.getElementById("popupContainer");
    const calendarTable = document.querySelector(".table");

    popupContainer.style.display = "none";
    calendarTable.style.marginRight = "0";
    calendarTable.style.width = "100%";
    calendarTable.style.overflowX = "auto";
    calendarTable.style.padding = "1rem";
    window.scrollTo(0, 0);
  }
}

export function closePopup(isConfirm, selectedTimeSlots) {
  const popupContainer = document.getElementById("popupContainer");
  const calendarTable = document.querySelector(".table");

  popupContainer.style.display = "none";
  calendarTable.style.marginRight = "0";
  calendarTable.style.width = "100%";
  calendarTable.style.overflowX = "auto";
  calendarTable.style.padding = "1rem";
  window.scrollTo(0, 0);

  // Remove the added meetings (i.e. meetings in the staging) from the calendar if not confirmed
  if (isConfirm === "false") {
    console.log("LIST selectedTimeSlots", selectedTimeSlots);
    selectedTimeSlots.forEach((meeting) => {
      console.log("selectedTimeSlots", meeting);
      removeTimeFromCalendar(meeting);
    });
  }
}

// (5) Show schedules/meetings in the schedule page

// the not section by invitee version
// export async function showSchedule(selectedScheduleId, handleSelectMeeting) {
//   var confirmButton = document.getElementById("confirmButton");
//   var popupContent = document.getElementById("popupContent");
//   var backButton = document.getElementById("backButton");
//   var phaseLinks = document.querySelectorAll("#popupContainer a");
//   var phaseParagraphs = document.querySelectorAll("#popupContainer p");
//   var suggestedScheduleButton = document.getElementById(
//     "suggestedScheduleButton",
//   );
//   var customizeCalendarInstruction = document.getElementById(
//     "customized-calendar-instruction",
//   );
//
//   // Hide confirm button, suggested schedule button, and phase links
//   confirmButton.style.display = "none";
//   suggestedScheduleButton.style.display = "none";
//   for (var i = 0; i < phaseLinks.length; i++) {
//     phaseLinks[i].style.display = "none";
//     phaseParagraphs[i].style.backgroundColor = "none";
//     phaseParagraphs[i].style.padding = 0;
//     phaseParagraphs[i].style.borderRadius = 0;
//   }
//
//   // Show back button
//   backButton.style.display = "block";
//
//   // Update instructions
//   customizeCalendarInstruction.textContent =
//     "Select your preferred meeting time";
//
//   // Reset popup content
//   popupContent.innerHTML = "";
//
//   try {
//     // Fetch meetings for the selected schedule
//     const meetings = await fetchMeetings(selectedScheduleId);
//
//     // Filter out pending meetings (not confirmed)
//     const pendingMeetings = meetings.filter((meeting) => !meeting.confirmed);
//     console.log(pendingMeetings);
//
//     if (pendingMeetings.length === 0) {
//       // No pending meetings, display empty message
//       popupContent.innerHTML = `
//                 <div class="empty-stage-wrapper">
//                     <div class="icon check-icon">✅</div>
//                     <div class="emptyStage">There is no pending meetings for this schedule</div>
//                 </div>
//             `;
//     } else {
//       pendingMeetings.forEach((meeting) => {
//         // Create student section
//         const studentSection = document.createElement("div");
//         studentSection.classList.add("student-section");
//         studentSection.style.backgroundColor = meeting.color;
//         studentSection.style.borderRadius = "10px";
//         studentSection.style.padding = "10px";
//         studentSection.style.marginBottom = "10px";
//         studentSection.style.fontSize = "1rem";
//         studentSection.innerHTML = `<strong>${meeting.invitee}</strong>`;
//
//         // Check if invitee response is received
//         if (meeting.isInviteeResponseReceived) {
//           // Create button for confirmed meeting
//           const button = document.createElement("button");
//           button.textContent = `${meeting.day} ${formatMeetingTime(meeting.time)}`;
//           button.style.backgroundColor = meeting.color;
//           button.style.border = "none";
//           button.style.borderRadius = "10px";
//           button.style.padding = "10px";
//           button.style.marginBottom = "10px";
//           button.style.fontSize = "1rem";
//
//           // Attach event listener to the button
//           button.addEventListener("click", () => {
//             addStagingTimeToCalendar(
//               meeting.date,
//               meeting.day,
//               meeting.time,
//               meeting.duration,
//               meeting.title,
//               meeting.invitee,
//               meeting.color,
//             );
//             handleSelectMeeting(meeting);
//           });
//
//           // Create schedule section
//           const scheduleSection = document.createElement("div");
//           scheduleSection.classList.add("schedule-section");
//           scheduleSection.style.borderRadius = "10px";
//           scheduleSection.style.padding = "10px";
//           scheduleSection.style.marginBottom = "10px";
//           scheduleSection.appendChild(button);
//
//           // Append student section and schedule section to popup content
//           popupContent.appendChild(studentSection);
//           popupContent.appendChild(scheduleSection);
//         } else {
//           // Create empty response message for meeting without response
//           const emptyResponseMessage = document.createElement("div");
//           emptyResponseMessage.classList.add("empty-student-response");
//           emptyResponseMessage.innerHTML = `⚠️ The student has not provided information.<br><button class="send-reminder-button">Send Reminder</button>`;
//
//           // Add click event listener to the "Send Reminder" button
//           emptyResponseMessage
//             .querySelector(".send-reminder-button")
//             .addEventListener("click", () => {
//               // Call function to show reminder popup
//               showReminderPopup();
//             });
//
//           // Append student section and empty response message to popup content
//           popupContent.appendChild(studentSection);
//           popupContent.appendChild(emptyResponseMessage);
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching meetings:", error);
//   }
// }

export async function showSchedule(
  selectedScheduleId,
  handleSelectMeeting,
  getContactName,
) {
  var confirmButton = document.getElementById("confirmButton");
  var popupContent = document.getElementById("popupContent");
  var backButton = document.getElementById("backButton");
  var phaseLinks = document.querySelectorAll("#popupContainer a");
  var phaseParagraphs = document.querySelectorAll("#popupContainer p");
  var suggestedScheduleButton = document.getElementById(
    "suggestedScheduleButton",
  );
  var customizeCalendarInstruction = document.getElementById(
    "customized-calendar-instruction",
  );

  // Hide confirm button, suggested schedule button, and phase links
  confirmButton.style.display = "none";
  suggestedScheduleButton.style.display = "none";
  for (var i = 0; i < phaseLinks.length; i++) {
    phaseLinks[i].style.display = "none";
    phaseParagraphs[i].style.backgroundColor = "none";
    phaseParagraphs[i].style.padding = 0;
    phaseParagraphs[i].style.borderRadius = 0;
  }

  // Show back button
  backButton.style.display = "block";

  // Update instructions
  customizeCalendarInstruction.textContent =
    "Select your preferred meeting time";

  // Reset popup content
  popupContent.innerHTML = "";

  try {
    // Fetch meetings for the selected schedule
    const meetings = await fetchMeetings(selectedScheduleId);

    // Filter out pending meetings (not confirmed)
    const pendingMeetings = meetings.filter((meeting) => !meeting.confirmed);
    console.log(pendingMeetings);

    if (pendingMeetings.length === 0) {
      // No pending meetings, display empty message
      popupContent.innerHTML = `
                <div class="empty-stage-wrapper">
                    <div class="icon check-icon">✅</div>
                    <div class="emptyStage">There is no pending meetings for this schedule</div>
                </div>
            `;
    } else {
      const meetingsByInvitee = {};

      pendingMeetings.forEach((meeting) => {
        // Group meetings by invitee
        if (!meetingsByInvitee[meeting.invitee]) {
          meetingsByInvitee[meeting.invitee] = [];
        }
        meetingsByInvitee[meeting.invitee].push(meeting);
      });

      // Iterate over meetings grouped by invitee
      Object.entries(meetingsByInvitee).forEach(
        ([invitee, inviteeMeetings]) => {
          // Create invitee section element
          const inviteeSection = document.createElement("div");
          inviteeSection.classList.add("student-section");
          inviteeSection.style.borderRadius = "10px";
          inviteeSection.style.padding = "10px";
          inviteeSection.style.marginBottom = "10px";
          inviteeSection.style.fontSize = "1rem";
          inviteeSection.style.display = "flex";
          inviteeSection.style.flexDirection = "column";
          inviteeSection.innerHTML = `<strong>${getContactName(invitee)}</strong>`;

          // Append invitee section to popup content
          popupContent.appendChild(inviteeSection);
          // Iterate over invitee meetings
          inviteeMeetings.forEach((meeting) => {
            if (meeting.isInviteeResponseReceived) {
              // Create button for confirmed meeting
              const button = document.createElement("button");
              button.textContent = `${meeting.day} ${formatMeetingTime(meeting.time)}`;
              button.style.backgroundColor = meeting.color;
              button.style.border = "none";
              button.style.borderRadius = "10px";
              button.style.padding = "10px";
              button.style.marginBottom = "10px";
              button.style.fontSize = "1rem";

              // Attach event listener to the button
              button.addEventListener("click", () => {
                addStagingTimeToCalendar(
                  meeting.date,
                  meeting.day,
                  meeting.time,
                  meeting.duration,
                  meeting.title,
                  meeting.invitee,
                  meeting.color,
                  getContactName,
                );
                handleSelectMeeting(meeting);
              });

              // Append button to invitee section
              inviteeSection.appendChild(button);
            } else {
              // Create empty response message for meeting without response
              const emptyResponseMessage = document.createElement("div");
              emptyResponseMessage.classList.add("empty-student-response");
              emptyResponseMessage.innerHTML = `⚠️ The student has not provided information.<br><button class="send-reminder-button">Send Reminder</button>`;

              // Add click event listener to the "Send Reminder" button
              emptyResponseMessage
                .querySelector(".send-reminder-button")
                .addEventListener("click", () => {
                  // Call function to show reminder popup
                  showReminderPopup();
                });

              // Append student section and empty response message to popup content
              popupContent.appendChild(inviteeSection);
              popupContent.appendChild(emptyResponseMessage);
            }
          });
        },
      );
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
  }
}

export function showScheduleList() {
  var confirmButton = document.getElementById("confirmButton");
  var popupContent = document.getElementById("popupContent");
  var backButton = document.getElementById("backButton");
  var phaseLinks = document.querySelectorAll("#popupContainer a");
  var phaseParagraphs = document.querySelectorAll("#popupContainer p");
  var suggestedScheduleButton = document.getElementById(
    "suggestedScheduleButton",
  );
  var customizeCalendarInstruction = document.getElementById(
    "customized-calendar-instruction",
  );

  suggestedScheduleButton.style.display = "flex";
  confirmButton.style.display = "flex";
  customizeCalendarInstruction.textContent = "Select a schedule";
  customizeCalendarInstruction.style.fontSize = "1rem";

  for (var i = 0; i < phaseLinks.length; i++) {
    phaseLinks[i].style.display = "block";
    phaseParagraphs[i].style.backgroundColor = "lightgrey";
    phaseParagraphs[i].style.padding = "10px";
    phaseParagraphs[i].style.borderRadius = "10px";
  }

  backButton.style.display = "none";

  // Reset popup content
  popupContent.innerHTML = "";
  showDefaultPopupContent();
}

function showDefaultPopupContent() {
  var popupContent = document.getElementById("popupContent");
}

function formatMeetingTime(timeString) {
  // Parse the time string into a Date object
  const time = new Date(`2000-01-01T${timeString}`);

  // Use options for 12-hour time format with AM/PM
  const options = { hour: "numeric", minute: "2-digit", hour12: true };

  // Format the time using the toLocaleTimeString method
  const formattedTime = time.toLocaleTimeString("en-US", options);

  return formattedTime;
}

// function to add the meetings in the staging areas (i.e. with dash) so that use can see its future plan in staging period
function addStagingTimeToCalendar(
  date,
  day,
  time,
  duration,
  title,
  invitee,
  color,
  getContactName,
) {
  let formattedTime = formatBackendTime(time, duration);
  let startHour = parseInt(formattedTime.split("-")[0]);
  let endHour = parseInt(formattedTime.split("-")[1]);
  const clock = time.split(" ")[1];
  const timeOfDay = `${startHour}${clock}`;

  const startRow = timesOfDay.indexOf(convertTo24HourFormat(timeOfDay)) + 1; // Get the row index based on the start time
  const cellIndex = dayIndex(day);

  // check if the date matches the date in header
  let columnHeader = document.querySelector(
    `.table th:nth-child(${dayIndex(day) + 2})`,
  );

  // Extract the day number from the date string
  // Extract the day number from the date string
  let dayNumber = parseInt(date.split("-")[2]);
  // Check if the date matches the date in the header
  if (!columnHeader || !/\d+/.test(columnHeader.textContent)) {
    return;
  }

  const columnHeaderDayNumber = parseInt(
    columnHeader.textContent.match(/\d+/)[0],
  );

  if (columnHeaderDayNumber !== dayNumber) {
    return;
  }

  if (startRow !== -1 && cellIndex !== -1) {
    const rowspan = endHour - startHour;
    console.log("endHour", endHour);

    // Update the calendar with the provided data
    const calendarTable = document.querySelector(".table");
    if (calendarTable) {
      for (let i = 0; i < rowspan; i++) {
        const currentRow = startRow + i;
        const row = calendarTable.querySelector(
          `#calendar-body tr:nth-child(${currentRow})`,
        );
        if (row) {
          const cell = row.querySelector(`td:nth-child(${cellIndex + 2})`);
          if (cell) {
            if (i === 0) {
              // Check for conflict
              if (checkConflict(cell, title, invitee)) {
                // Show a confirmation prompt for resolving the conflict
                window.alert(
                  `This time slot on ${day} at ${time} is already booked. Please reselect your choice.`,
                );
                // if (!confirmation) {
                //   return; // If the user cancels, exit and no changes will be made
                // }
                return;
              }
              // No need to push data into selectedTimeSlots since this data is provided as arguments
              cell.innerHTML = `<span style="display: block" class="dashed-border">${title} with ${getContactName(invitee)}</span>`;
              cell.style.backgroundColor = color;
              cell.rowSpan = rowspan; // No increment on rowspan in the first cell
            } else {
              // For cells in the same row but not in the first column of rowspan
              cell.style.display = "none"; // Hide the cell
            }
          }
        }
      }
    }
  }
}

function removeTimeFromCalendar(meetingToRemove) {
  const { day, time, duration } = meetingToRemove;
  let formattedTime = formatBackendTime(time, duration);
  let startHour = parseInt(formattedTime.split("-")[0]);
  let endHour = parseInt(formattedTime.split("-")[1]);
  const clock = time.split(" ")[1];
  const timeOfDay = `${startHour}${clock}`;

  const startRow = timesOfDay.indexOf(convertTo24HourFormat(timeOfDay)) + 1;
  const cellIndex = dayIndex(day);

  if (startRow !== -1 && cellIndex !== -1) {
    const rowspan = endHour - startHour;

    const calendarTable = document.querySelector(".table");
    if (calendarTable) {
      for (let i = 0; i < rowspan; i++) {
        const currentRow = startRow + i;
        const row = calendarTable.querySelector(
          `#calendar-body tr:nth-child(${currentRow})`,
        );
        if (row) {
          const cell = row.querySelector(`td:nth-child(${cellIndex + 2})`);
          if (cell) {
            cell.rowSpan = 1; // Reset rowspan
            cell.innerHTML = "";
            cell.style.backgroundColor = "";
            cell.style.display = "table-cell";
          }
        }
      }
    }
  }
}

export function showReminderPopup() {
  alert("Reminder has been sent!");
}

// monthly calendar
export function generateMonthlyCalendar(
  month,
  year,
  confirmedMeetings,
  getContactName,
) {
  // Use the provided month and year or default to the current month and year
  month = month !== undefined ? month : new Date().getMonth();
  year = year !== undefined ? year : new Date().getFullYear();

  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let firstDayOfMonth = new Date(year, month, 1);
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDayOffset = firstDayOfMonth.getDay() % 7;
  let daysOfWeekRow = document.getElementById("daysOfWeekRow");
  let calendarBody = document.getElementById("calendar-body");

  daysOfWeekRow.innerHTML = "";
  calendarBody.innerHTML = "";

  // Create days of the week headers
  for (let day of daysOfWeek) {
    let th = document.createElement("th");
    th.textContent = day;
    daysOfWeekRow.appendChild(th);
  }

  // Create an initial row
  let row = document.createElement("tr");

  // Create empty cells for the offset
  for (let i = 0; i < startDayOffset; i++) {
    let emptyCell = document.createElement("td");
    row.appendChild(emptyCell);
  }

  // Create calendar cells for each day of the month
  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
    let cell = document.createElement("td");
    cell.textContent = dayOfMonth;

    if (
      dayOfMonth === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      // Highlight today
      cell.classList.add("today");
    }

    row.appendChild(cell);

    // Start a new row every 7 cells (since 7 days per week)
    if (
      (startDayOffset + dayOfMonth - 1) % 7 === 6 ||
      dayOfMonth === daysInMonth
    ) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }
  }
  updateMonthlyCalendar(month, confirmedMeetings, getContactName);

  // Monthly calendar disables the "add new meeting" button
  document.getElementById("btn-add-meeting-container").style.display = "none";
}

function updateMonthlyCalendar(
  currentMonth,
  confirmedMeetings,
  getContactName,
) {
  // Sort meetings by start time in chronological order
  confirmedMeetings.sort((a, b) => {
    const startTimeA = parseInt(a.time.split("-")[0]);
    const startTimeB = parseInt(b.time.split("-")[0]);
    return startTimeA - startTimeB;
  });

  let uniqueTime = new Set();
  let uniqueDate = new Set();

  // Iterate through the confirmed meetings and update the monthly calendar
  confirmedMeetings.forEach((meeting) => {
    let { date, time, title, invitee, color } = meeting;
    const [year, month, day] = date.split("-"); // Split the date by "-" to get year, month, and day
    console.log("month aha", month);
    const dayNumber = parseInt(day); // Parse the day part to an integer
    // Check if the meeting date matches the selected month
    if (
      parseInt(month - 1) === currentMonth &&
      !(uniqueTime.has(time) && uniqueDate.has(date))
    ) {
      uniqueTime.add(time);
      uniqueDate.add(date);

      addTimeToMonthlyCalendar(dayNumber, meeting, getContactName);
    }
  });
}

function addTimeToMonthlyCalendar(dayOfMonth, meeting, getContactName) {
  let cells = document.querySelectorAll("td");
  let foundCell = null;

  // Iterate through the cells
  for (let i = 0; i < cells.length; i++) {
    // Check if the content of the cell matches the dayOfMonth
    if (parseInt(cells[i].textContent) === dayOfMonth) {
      foundCell = cells[i];
      break; // Exit the loop when find the matched cell
    }
  }
  if (foundCell) {
    const { date, time, title, invitee, color } = meeting;

    const header = document.getElementById("headerTitle").textContent;
    // Get the month and year from the meeting's date
    const meetingMonth = date.substring(5, 7);
    console.log("month meeting", meetingMonth);
    const meetingYear = date.substring(0, 4);
    if (
      header.includes(getMonthAbbreviation(meetingMonth)) &&
      header.includes(meetingYear)
    ) {
      // Create a new line for the meeting within the same cell
      let meetingLine = document.createElement("div");
      meetingLine.className = "meeting-line";

      // Create the button element
      let button = document.createElement("button");
      button.id = `meetingBtn_${dayOfMonth}_${time}_${title}_${getContactName(invitee)}`;
      button.style.backgroundColor = color;
      button.style.border = "none";
      button.style.borderRadius = "10px";
      button.style.padding = "10px";
      button.style.marginBottom = "10px";
      button.style.fontSize = "1rem";
      button.textContent = `${title} with ${getContactName(invitee)}`;

      // Add event listener to the button
      button.addEventListener("click", () => {
        getMeetingDetails(
          dayOfMonth,
          time,
          title,
          getContactName(invitee),
          color,
        );
      });

      // Append the button to the meeting line
      meetingLine.appendChild(button);

      meetingLine.style.width = "100%";
      meetingLine.style.marginTop = "5px";

      foundCell.appendChild(meetingLine);
    }
  } else {
    console.error("Cell not found.");
  }
}

function getMeetingDetails(dayOfMonth, time, title, invitee, color) {
  // Display the details in a pop-up
  openMeetingPopup(dayOfMonth, time, title, invitee, color);
}

function openMeetingPopup(dayOfMonth, time, title, invitee, color) {
  const buttonId = `meetingBtn_${dayOfMonth}_${time}_${title}_${invitee}`;
  const button = document.getElementById(buttonId);

  if (!button) {
    return;
  }

  // Get the button's position relative to the view
  const buttonRect = button.getBoundingClientRect();

  // Create a pop-up container
  const popupContainer = document.createElement("div");
  popupContainer.className = "meeting-popup-container";
  popupContainer.style.position = "absolute";
  popupContainer.style.top = buttonRect.bottom + "px";
  popupContainer.style.left = buttonRect.left + "px";
  popupContainer.style.display = "block";

  const popupId = `popup-${Date.now()}`;

  popupContainer.id = popupId;

  // Create the pop-up content
  const popupContent = document.createElement("div");
  popupContent.className = "meeting-popup-content";

  const headerTitle = document.getElementById("headerTitle");
  const [currentMonth, currentYear] = headerTitle.textContent.split(" ");
  const formattedDate = `${currentMonth} ${dayOfMonth}, ${currentYear}`;
  const eventDetails = `Event: ${title} with ${invitee}`;

  // Create the close button element
  const closeButton = document.createElement("span");
  closeButton.className = "meeting-popup-close-btn";
  closeButton.textContent = "x";

  // Add event listener to the close button
  closeButton.addEventListener("click", () => {
    closeMeetingPopup(popupId);
  });

  // Set innerHTML of popupContent
  popupContent.innerHTML = `
        <p>Date: ${formattedDate}</p>
        <p>Time: ${time}</p>
        <p>Event: ${eventDetails}</p>
    `;

  // Append the close button to the popup content
  popupContent.prepend(closeButton);

  popupContainer.appendChild(popupContent);

  document.body.appendChild(popupContainer);

  positionPopup(popupContainer);
}

function closeMeetingPopup(popupId) {
  const popupContainer = document.getElementById(popupId);
  if (popupContainer) {
    popupContainer.remove();
  }
}

function positionPopup(popupContainer) {
  const popupRect = popupContainer.getBoundingClientRect();

  // Check if the popup exceeds the right side of the view
  if (popupRect.right > window.innerWidth) {
    popupContainer.style.left = `${window.innerWidth - popupRect.width}px`;
  }

  // Check if the popup exceeds the bottom side of the view
  if (popupRect.bottom > window.innerHeight) {
    popupContainer.style.top = `${window.innerHeight - popupRect.height}px`;
  }
}

const monthMapping = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export function generateMonthlyHeader(year, month) {
  const monthYearDate = new Date(year, month, 1);
  const formattedMonthYear = monthYearDate.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  return formattedMonthYear;
}
