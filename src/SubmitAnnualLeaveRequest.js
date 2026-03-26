import React from 'react';
import './SubmitAnnualLeaveRequest.css';
import calendarIcon from './images/calendar-icon.svg';

export default function SubmitAnnualLeaveRequest() {
    // This is a placeholder for the AnnualLeaveRequest class.
    const calendarLogo = <img src={calendarIcon} alt="[Calendar Icon]" />;
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
            {/*<p>No recent requests found.</p>*/}
            <RecentRequestHistory />

        </div>
    );
}

function RecentRequestHistory() {
    // This is a placeholder for the RecentRequestItem class. 
    return (
        <div className='recent-request-container'>
                <RecentRequestItem
                    startDay={25}
                    startMonth="Mar"
                    endDay={27}
                    endMonth="Mar"
                    startYear={2026}
                    endYear={2026}
                    reason="Family vacation"
                    status="Approved"
                />
                <RecentRequestItem
                    startDay={14}
                    startMonth="Feb"
                    endDay={16}
                    endMonth="Feb"
                    startYear={2026}
                    endYear={2026}
                    reason="Personal reasons"
                    status="Pending"
                />
                <RecentRequestItem
                    startDay={10}
                    startMonth="Jan"
                    endDay={12}
                    endMonth="Jan"
                    startYear={2026}
                    endYear={2026}
                    reason="Medical appointment"
                    status="Rejected"
                />

                <div className= 'additional-requests-history'>
                    <p>Additional request history...</p>
                </div>
        </div>
    );
}

function RecentRequestItem({startDay, startMonth, startYear, endDay, endMonth, endYear, reason, status }) {
    if (!startDay || !startMonth || !endDay || !endMonth || !startYear || !endYear || !reason || !status) {
        return null; // Return null if any of the required props are missing
    }

    if (startYear === endYear) {
        startYear = '';
    }
    return (
            <div className='recent-request-item'>
                <section className='recent-request-details'>
                    <section>
                        <p><strong>{startMonth} {startDay} {startYear} - {endMonth} {endDay}, {endYear}</strong></p>
                        <p>{reason}</p>
                    </section>
                    <section className={`status-${status.toLowerCase()}`}>
                        {status}
                    </section>
                </section>
            </div>
    );
}