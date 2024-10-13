import React, {useState} from "react";
import {convertToAbbreviation, convertPriorityToInt} from "../utils";

function AddAvailabilityModal({toggleModal, confirmAddAvailability}) {
    const [day, setDay] = useState("Sunday");
    const [startTime, setStartTime] = useState("");
    const [period, setPeriod] = useState("AM");
    const [duration, setDuration] = useState("");
    const [preference, setPreference] = useState("Low");

    const handleConfirm = () => {
        if (!day || !startTime || !duration || !preference) {
            console.error("Some form fields are missing or invalid.");
            return;
        }

        // Parse the start time
        let hours = parseInt(startTime.split(":")[0]);
        let minutes = parseInt(startTime.split(":")[1]);
        if (period === "PM" && hours < 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }
        const formattedStartTime = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:00`;

        const newAvailability = {
            day: convertToAbbreviation(day),
            start_time: formattedStartTime,
            duration: parseInt(duration),
            priority: convertPriorityToInt(preference),
        };

        // Call endpoint
        confirmAddAvailability(newAvailability);
    };

    return (
        <div id="addAvailabilityModal">
            <div className="modal-container">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Availability</h4>
                            <button type="button" className="close" onClick={toggleModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="day">Day:</label>
                                <select id="day" className="form-control" value={day}
                                        onChange={(e) => setDay(e.target.value)}>
                                    <option value="Sunday">Sunday</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                </select>

                            </div>
                            <div className="form-group">
                                <label htmlFor="startTime">Start Time:</label>
                                <input
                                    type="time"
                                    id="startTime"
                                    className="form-control"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Duration (in minutes):</label>
                                <input
                                    type="number"
                                    id="duration"
                                    className="form-control"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="preference">Preference:</label>
                                <select
                                    id="preference"
                                    className="form-control"
                                    value={preference}
                                    onChange={(e) => setPreference(e.target.value)}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAvailabilityModal;
