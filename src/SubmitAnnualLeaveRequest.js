import React from 'react';
import './SubmitAnnualLeaveRequest.css';

export default function SubmitAnnualLeaveRequest() {
    // This is a placeholder for the AnnualLeaveRequest class.
    const calendarLogo = <img src="calendar-logo.jpg" alt="[CalendarLogo]" />;
    return (
        <div className='page'>
            <header>
                <h1>{calendarLogo} Annual Leave Request</h1>
                <h3>Submit your annual leave request for approval</h3>
            </header>
                <div className = 'layout'>
                    <NewLeaveRquest />
                    <YourRecentRequests />
                </div>
        </div>
    );
}

function NewLeaveRquest() {
    // This is a placeholder for the NewLeaveRequest class. 
    return (
        <div className='form-column'> 
            <h2>New Leave Request</h2>
                <form>
                    <label htmlFor="start-date">Start Date:</label>
                    <input type="date" id="start-date" name="start-date" required />
                    <br />
                    <label htmlFor="end-date">End Date:</label>
                    <input type="date" id="end-date" name="end-date" required />
                    <br />
                    <label htmlFor="reason">Reason:</label>
                    <textarea id="reason" name="reason" placeholder='Brief description of your leave reason...'required />
                    <br />
                    <button type="submit">Submit Request</button>
                </form>

        </div>
    );
}

function YourRecentRequests() {
    // This is a placeholder for the YourRecentRequests class.   
    return (
        <div className= 'recents-column'>
            <h2>Your Recent Requests</h2>
            <p>No recent requests found.</p>
        </div>
    );
}