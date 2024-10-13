import React, {useState} from "react";
import {GetContactById} from "../utils";

function AddInviteModal({toggleInviteModal, sendInvite, contacts, schedules}){
    // toggleInviteModal is a state that 
    
    const [contact, setContact] = useState([]);
    const [schedule, setSchedule] = useState([]);

    const selectContact = () => {
        var contact = document.getElementById("selectContact").value;
        if (!(contact === "NoContact")){
            var contact = Number(document.getElementById("selectContact").value);
        }
        setContact(contact);
    }

    const selectMeeting = () => {
        var meeting = document.getElementById("selectMeeting").value;
        if (!(meeting === "NoSchedule")){
            var meeting = Number(document.getElementById("selectMeeting").value);
        }
        setSchedule(meeting);
    }

    const performSend = () => {
        if (contact === "NoContact" || schedule === "NoSchedule"){
            console.error("Please select a contact or meeting");
            return;
        }
        let c = Number(contact);
        let s = Number(schedule);

        const newInvite = {
            receiver: c,
            schedule: s
        }

        sendInvite(newInvite);
    }

    return (
        <div id="addInviteModal">
            <div className="modal-container">
                <div className="modal-dialog">
                    <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title" id="sendInviteLabel">
                        Send a new invite!
                        </h5>
                    </div>
                    <div className="modal-body">
                    <form id="sendInviteForm">
                        <div className="mb-3">
                            <label htmlFor="contactName" className="form-label">
                            Select Contact: {" "}
                            </label>
                            <select id="selectContact" onChange={selectContact}>
                                <option value="NoContact" selected="">
                                --Select Contact--
                                </option>
                                {contacts.map((contact) => (
                                    <option value={contact.id}>{GetContactById(contact.id, contacts)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                                <label htmlFor="meeting" className="form-label">
                                Select Meeting:{" "}
                                </label>
                                <select id="selectMeeting" onChange={selectMeeting}>
                                <option value="NoSchedule">--Select Schedule--</option>
                                    {schedules.map((schedule) => (
                                        <option value={schedule.id}>{schedule.id}</option>
                                    ))}
                                </select>
                            </div>
                        <button type="submit" className="btn btn-primary" onClick={performSend}>
                            Send Invite
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={toggleInviteModal}>
                            Close
                        </button>
                    </form>
                    
                    </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddInviteModal;