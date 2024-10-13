import React from "react";

// a helper which returns a contact's name by their id
export function GetContactById(contactId, contactsList){
    for (let i = 0; i < contactsList.length; i++){
        if (contactId === contactsList[i].id){
            return contactsList[i].name;
        }
    }
};

// a helper which returns a schedule's name by id
export function GetScheduleById(scheduleId, scheduleList){
    for (let i = 0; i < scheduleList.length; i++){
        if (scheduleId === scheduleList[i].id){
            return scheduleList[i].name;
        }
    }
};

// a helper which generates the desired td with the appropriate styling based on the confirmation status
export function ConfirmationTD(confirmation){
    switch (confirmation){
        case true:
            return(
                <td style={{ color: "#5fad74", paddingTop: "1rem" }}>Confirmed</td>
            );
        case false:
            return (
                <td style={{ color: "#c7362c", paddingTop: "1rem" }}>Unconfirmed</td>
            );
    }
}

// I'll need another one to get schedule name by ID (lmao nvm)

// a helper which returns a list (array) of contact ids that the user has sent invites to, with duplicates removed
// this is for the filter's options
export function GetFlattenedContacts(inviteData){
    let lst = [];
    for (let i = 0; i < inviteData.length; i++){
        if(!(lst.includes(inviteData[i].receiver))){
            lst.push(inviteData[i].receiver);
        }
    }
    return lst;
}

// a helper which returns an array with the invites corresponding to a given contact
export function ReceiverFilter(inviteData, contact){
    if(contact === "Default"){
        return inviteData;
    }
    else{
        let lst = [];
        for (let i = 0; i < inviteData.length; i++){
            if(inviteData[i].receiver === contact){
                lst.push(inviteData[i]);
            }
        }
        return lst;
    }
    
}

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

// the function that formats the receiver availabilities to use in the suggested schedules app
// receiverAvails is the response that you get when you call /api/receiver_avail/overview/
// scheduleList is the response that you get when you call /api/schedules/all/, a list of the current user's schedules
export function formatAvailabilities(receiverAvails, scheduleList){
    let formattedData = {};
    for(let i = 0; i < receiverAvails.length; i++){
        let sched = receiverAvails[i].corresponding_schedule;
        let cont = receiverAvails[i].corresponding_contact;
        let name = GetScheduleById(sched, scheduleList);
        if (formattedData[name] === undefined){
            formattedData[name] = {};
        }
        let {id, corresponding_contact, corresponding_schedule, priority, ...rest} = receiverAvails[i];
        const newData = {
            "day": getFullDay(rest["day"]),
            "start_time": formatTime(rest["start_time"]),
            "duration": rest["duration"]
        };
        if (formattedData[name][cont] === undefined){
            formattedData[name][cont] = [];
        }
        formattedData[name][cont].push(newData);
    }

    return formattedData;
}