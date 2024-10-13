export const convertPriorityToInt = (priorityString) => {
  switch (priorityString.toLowerCase()) {
    case "low":
      return 3;
    case "medium":
      return 2;
    case "high":
      return 1;
    default:
      return 3;
  }
};
export const convertToAbbreviation = (fullDay) => {
  switch (fullDay.toLowerCase()) {
    case "sunday":
      return "Sun";
    case "monday":
      return "Mon";
    case "tuesday":
      return "Tue";
    case "wednesday":
      return "Wed";
    case "thursday":
      return "Thu";
    case "friday":
      return "Fri";
    case "saturday":
      return "Sat";
    default:
      return "";
  }
};

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      return "Unknown";
  }
};

// Function to convert abbrev day name to full form
export const getFullDay = (abbreviatedDay) => {
  switch (abbreviatedDay.toLowerCase()) {
    case "sun":
      return "Sunday";
    case "mon":
      return "Monday";
    case "tue":
      return "Tuesday";
    case "wed":
      return "Wednesday";
    case "thu":
      return "Thursday";
    case "fri":
      return "Friday";
    case "sat":
      return "Saturday";
    default:
      return abbreviatedDay;
  }
};

export function formatTime(time) {
  const [hours, minutes] = time.split(":");
  let formattedHours = parseInt(hours);
  let period = "AM";

  if (formattedHours === 0) {
    formattedHours = 12;
  } else if (formattedHours === 12) {
    period = "PM";
  } else if (formattedHours > 12) {
    formattedHours -= 12;
    period = "PM";
  }

  const formattedTime = `${formattedHours.toString().padStart(2, "0")}:${minutes} ${period}`;
  return formattedTime;
}

export function getAvails(contact, schedule, avails) {
  let ret = [];
  for (let i = 0; i < avails.length; i++) {
    if (
      Number(avails[i]["corresponding_contact"]) === Number(contact) &&
      Number(avails[i]["corresponding_schedule"]) === Number(schedule)
    ) {
      ret.push(avails[i]);
    }
  }
  return ret;
}

// ALL THE HELPER FUNCTIONS BELOW ARE NEEDED TO FORMAT THE RECEIVER AVAILABILITY

// a helper which returns a schedule's name by id
export function GetScheduleById(scheduleId, scheduleList) {
  for (let i = 0; i < scheduleList.length; i++) {
    if (scheduleId === scheduleList[i].id) {
      return scheduleList[i].name;
    }
  }
}

// the function that formats the receiver availabilities to use in the suggested schedules app
// receiverAvails is the response that you get when you call /api/receiver_avail/overview/
// scheduleList is the response that you get when you call /api/schedules/all/

export function formatAvailabilities(receiverAvails, scheduleList) {
  let formattedData = {};
  for (let i = 0; i < receiverAvails.length; i++) {
    let sched = receiverAvails[i].corresponding_schedule;
    let cont = receiverAvails[i].corresponding_contact;
    let name = GetScheduleById(sched, scheduleList);
    if (formattedData[name] === undefined) {
      formattedData[name] = {};
    }
    let {
      id,
      corresponding_contact,
      corresponding_schedule,
      priority,
      ...rest
    } = receiverAvails[i];
    const newData = {
      day: getFullDay(rest["day"]),
      start_time: formatTime(rest["start_time"]),
      duration: rest["duration"],
    };
    if (formattedData[name][cont] === undefined) {
      formattedData[name][cont] = [];
    }
    formattedData[name][cont].push(newData);
  }

  return formattedData;
}
