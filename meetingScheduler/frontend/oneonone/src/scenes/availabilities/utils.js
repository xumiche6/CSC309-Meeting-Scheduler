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
    let period = "am";

    if (formattedHours === 0) {
        formattedHours = 12;
    } else if (formattedHours === 12) {
        period = "pm";
    } else if (formattedHours > 12) {
        formattedHours -= 12;
        period = "pm";
    }

    const formattedTime = `${formattedHours.toString().padStart(2, "0")}:${minutes} ${period}`;
    return formattedTime;
}

