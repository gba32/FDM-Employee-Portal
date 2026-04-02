import React from 'react';
import '../css/SubmitAnnualLeaveRequest.css';
import calendarIcon from '../images/calendar-icon.svg';
import {Repository} from '../services/mockPortalData.js';

export default function SubmitAnnualLeaveRequest() {

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

    function createLeaveRequest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startDate = formData.get('start-date');
        const endDate = formData.get('end-date');
        const reason = formData.get('reason');
        ;
    }

    return (
        <div className='form-column'> 
            <h2>New Leave Request</h2>
                <form onSubmit={createLeaveRequest} className='leave-request-form'>
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

    return (
        <div className= 'recents-column'>
            <h2>Your Recent Requests</h2>
            {/*<p>No recent requests found.</p>*/} {/* Placeholder for recent request history. */}
            <RecentRequestHistory />

        </div>
    );
}

function RecentRequestHistory() {
    
    /*
      - Helper functions for converting date formats and formatting the display of recent requests.
      - In a real application, this would likely involve fetching recent request data from an API and formatting it for display.
     */

    // Helper function for converting a date to a triplet
    function dateToTriplet(date){
        date = new Date(date);
        const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        let name = month[date.getMonth()];
        return [date.getDate(), name, date.getFullYear()];
    }

    // Helper function for creating objects for formatted dates
    function formatDate(startDate, endDate) {
        let [sDay, sMonth, sYear] = dateToTriplet(startDate);
        let [eDay, eMonth, eYear] = dateToTriplet(endDate);
        return { sDay, sMonth, sYear, eDay, eMonth, eYear };
    }

    // Imports data for recent requests and converts it into RecentRequestItem components
    function getRecentRequests() {

        // fetch recent request data from 'API', format for display
        const mockData = Repository.LeaveRepository;
        return mockData.map(request => {
            const { sDay, sMonth, sYear, eDay, eMonth, eYear } = formatDate(request.startDate, request.endDate);
            return (
                <RecentRequestItem
                    key={request.requestID}
                    startDay={sDay}
                    startMonth={sMonth}
                    startYear={sYear}
                    endDay={eDay}
                    endMonth={eMonth}
                    endYear={eYear}
                    reason={request.reason}
                    status={request.leaveStatus}
                />
            );
        });
    }


    return (
        <>
            <div className='recent-request-container'>
                {getRecentRequests()}
            </div>

            <div className= 'additional-requests-history'>
                <p>Additional request history...</p>
            </div>
        </>
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