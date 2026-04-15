import { useEffect, useState } from "react";
import "../css/submitLeave.css";
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import calendarIcon from '../images/calendar-icon.svg';

const SubmitLeave = ({ repository, setRepository, user, triggerNotification}) => {
  if (!user) {
    return <p>Loading user data</p>;
  }
  const currentEmpID = user?.id;

      const calendarLogo = <img src={calendarIcon} alt="[Calendar Icon]" />;
      return (
          <div className='page'>
              <header>
                  <h1>{calendarLogo} Annual Leave Request</h1>
                  <h3>Submit your annual leave request for approval</h3>
              </header>
                  <div className = 'layout'>
                      <NewLeaveRquest
                        currentEmpID={currentEmpID}
                        repository={repository}
                        setRepository={setRepository}
                        triggerNotification={triggerNotification}
                      />
                      <YourRecentRequests currentEmpID={currentEmpID} repository={repository} />
                  </div>
          </div>
      );
  }

/*
  - This component allows employees to submit new leave requests and view their recent leave request history.
  - It consists of two main sections: the form for submitting a new leave request and a section displaying the employee's recent leave requests.
  - The component uses local state to manage the form inputs and the display of recent requests, and it interacts with a repository to store and retrieve leave request data.
*/
function NewLeaveRquest({ currentEmpID, repository, setRepository, triggerNotification }) { 

    // Function to add a new leave request to the repository
    function addLeaveRequest({ startDate, endDate, reason, empID }) {
        const totalDays = Math.round(
            Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
        ) + 1;

        const newRequestID = (repository?.length ?? 0) + 1;
        const leaveRequest = {
            requestID: newRequestID.toString(),
            startDate,
            endDate,
            totalDays,
            reason,
            empID,
            leaveStatus: 'Pending',
            resolverID: null,
        };

        const updatedRepository = [...(repository ?? []), leaveRequest];
        setRepository(updatedRepository);
        return leaveRequest;
    }

    // Handler for form submission to create a new leave request
    function createLeaveRequest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startDate = formData.get('start-date');
        const endDate = formData.get('end-date');
        const reason = formData.get('reason');

        // Basic validation for fields
        if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const today = new Date();

              if (start < today) {
                  triggerNotification('Start date cannot be in the past. Please select a valid start date.');
                  return;
              }

              if (end < start) {
                  triggerNotification('End date cannot be before start date. Please select a valid date range.');
                  return;
              }  
          }
        else{
            triggerNotification('Please fill in both start and end dates.');
            return;
        }

        if (!reason || reason.trim() === '') {
            triggerNotification('You must provide a reason for your leave request.');
            return;
        }
        
        console.log('Leave Request Created:', { startDate, endDate, reason });
        addLeaveRequest({
            startDate,
            endDate,
            reason,
            empID: currentEmpID,
        });
        console.log('Updated Leave Repository:', repository);
        triggerNotification('Request sent for approval!');
        e.target.reset();
        
    }

    return (
        <div className='form-column'> 
            <h2>New Leave Request</h2>
                <form onSubmit={createLeaveRequest} className='leave-request-form'>
                    <label htmlFor="start-date">Start Date:</label>
                    <input type="date" id="start-date" name="start-date" />
                    <br />
                    <label htmlFor="end-date">End Date:</label>
                    <input type="date" id="end-date" name="end-date" />
                    <br />
                    <label htmlFor="reason">Reason:</label>
                    <textarea id="reason" name="reason" placeholder='Brief description of your leave reason...' />
                    <br />
                    <button type="submit">Submit Request</button>
                </form>

        </div>
    );
}

/*
  - This component displays the employee's recent leave requests, showing key details such as the date range, reason, and status of each request.
  - It also includes functionality to view the full history of leave requests in a popup modal if there are more than three recent requests.
  - The component uses helper functions to format dates and manage the display of recent requests based on the data from the repository.
*/
function YourRecentRequests({ currentEmpID, repository }) {

    return (
        <div className= 'recents-column'>
            <h2>Your Recent Requests</h2>
            {/*<p>No recent requests found.</p>*/} {/* Placeholder for recent request history. */}
            <RecentRequestHistory currentEmpID={currentEmpID} repository={repository} />

        </div>
    );
}

/*
  - This component manages the display of recent leave requests for the employee, showing a summary of the most recent requests and providing an option to view the full history in a popup modal.
  - It includes helper functions to format dates and create components for each recent request, as well as managing the state for the popup display.
  - The component filters the repository data to show only the requests relevant to the current employee and formats it for display in a user-friendly manner.
*/
function RecentRequestHistory({ currentEmpID, repository }) {
    const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

    useEffect(() => {
        if (isHistoryPopupOpen) {
            document.body.classList.add('leave-history-popup-open');
        } else {
            document.body.classList.remove('leave-history-popup-open');
        }

        return () => {
            document.body.classList.remove('leave-history-popup-open');
        };
    }, [isHistoryPopupOpen]);
    
    /*
      - Helper functions for converting date formats and formatting the display of recent requests.
      - Mirrors task of fetching recent request data from an API and formatting it for display.
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
        const mockData = (repository ?? []).filter(
            request => request.empID === currentEmpID,
        );
        const earliestRequest = mockData.length < 3 ? 0 : mockData.length - 3;
        return mockData.slice(earliestRequest, mockData.length).map(request => {
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
                    reason={request.reason.slice(0, 50) + (request.reason.length > 50 ? '...' : '')}
                    status={request.leaveStatus}
                />
            );
        });
    }

    // Imports data for all requests the employee made and converts it into RecentRequestItem components
    function getAllRequests() {
        const mockData = (repository ?? []).filter(
            request => request.empID === currentEmpID,
        );
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

    const allRequests = (repository ?? []).filter(
        request => request.empID === currentEmpID,
    );
    let recentRequestsFinder = getRecentRequests();
    let additionalHistoryMsg = null;
        if (recentRequestsFinder === null || recentRequestsFinder.length === 0) {
            recentRequestsFinder = <p className='no-recent-requests'>No recent requests found.</p>;
        }
        if (allRequests.length > 3) {
            additionalHistoryMsg = <button><p className='additionalHistoryText'>Click to view more...</p></button>;
        }
    const recentRequests = recentRequestsFinder;

    return (
        <>
            <div className='recent-request-container'>
                {recentRequests}
                <div className= 'additional-requests-history'>
                    <Popup
                        trigger={additionalHistoryMsg}
                        modal
                        nested
                        onOpen={() => setIsHistoryPopupOpen(true)}
                        onClose={() => setIsHistoryPopupOpen(false)}
                    >
                        {close => (
                            <div className='modal'>
                                <div className='content'>
                                    <h2>Request History</h2>
                                    {getAllRequests()}
                                </div>
                                <div className='closePopup'>
                                    <button onClick={() => close()}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </Popup>

                </div>
            </div>
        </>
    );
}

/*
  - This component displays the details of a single leave request in the recent requests list, showing the date range, reason, and status of the request.
  - It formats the display based on the status of the request, using different styles for pending, approved, and rejected requests.
  - The component also handles cases where certain data may be missing, ensuring that it only renders when all necessary information is available.
*/
function RecentRequestItem({startDay, startMonth, startYear, endDay, endMonth, endYear, reason, status }) {

    if (!startDay || !startMonth || !endDay || !endMonth || !startYear || !endYear || !reason || !status) {
        return null; // Return null if any of the required props are missing
    }

    let commaForStartYear = ',';

    if (startYear === endYear) {
        startYear = '';
        commaForStartYear = '';
    }
    return (
            <div className='recent-request-item' id={`${status.toLowerCase()}`}>
                <section className='recent-request-details'>
                    <section>
                        <p><strong>{startMonth} {startDay}{commaForStartYear} {startYear} - {endMonth} {endDay}, {endYear}</strong></p>
                        <p>{reason}</p>
                    </section>
                    <section className={`status-${status.toLowerCase()}`}>
                        {status}
                    </section>
                </section>
            </div>
    );
}

export default SubmitLeave;