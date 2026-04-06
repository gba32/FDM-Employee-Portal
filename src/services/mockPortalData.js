//USE CASES:
//Submit Employment query - query object created and stored to QueryRepository array
//Resolve Technical Queries - how is a technical query resolved? via queryStatus from PENDING TO RESOLVED, resolvedBy empID of hr staff, dateResolved, resolutionNote of each object from itQuery array
//Resolve HR queries - same for HR queries
//Enumeration class for queryStatus rather than a 'resolved' boolean value type in Query Class
export const QueryStatus = Object.freeze({
  //using filter()
  PENDING: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected", //Although not stated in the class diagram, HR OR IT staff can deny a request
});
//Enumeration class for QueryType associated with Query class
export const QueryType = Object.freeze({
  HRQUERY: "HR Query",
  ITQUERY: "IT Query",
});

//USE CASES:
//Employee Submit Annual Leave Request
//Manager Approve Annual Leave Request: totalDays: (endDate-startDate)+1
//Enumeration class for LeaveStatus associated with AnnualLeaveReqeust class
export const LeaveStatus = Object.freeze({
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PENDING: "Pending",
});

//Enumeration class for LeaveActionType associated with LeaveHandler (which is represented by the submitLeave and ApproveLeave components )
//Used to display alert pop up/notification in SubmitLeave and ApproveLeave UI  based on LeaveActionType
export const LeaveActionType = Object.freeze({
  SENT_REQUEST: "Sent Request", //To Employee:sent success message after submission
  APPROVED_REQUEST: "Approved Request", //To Employee and Manager: triggers approved message and deducts balance
  REJECTED_REQUEST: "Rejected Request", //To Employee and Manager: triggers rejected message
  DRAFT_REQUEST: "Draft Request", //To Employee:triggers drafted message for future editing
});

//USE CASE:
//IT: Modify User Access Permissions - focuses on changing employee object's role property
//Enumeration class for PermissionType not added in the class diagram
export const PermissionsType = Object.freeze({
  FILE_SHARE: "fileShareAccess",
  VPN: "vpnAccess",
});

//Enumeration class for AnnouncementStatus not added in class diagram
export const AnnouncementStatus = Object.freeze({
  PUBLISHED: "PUBLISHED",
  DELETED: "DELETED",
});

//Repository abstract class
export const Repository = {
  //USE CASE:
  //IT: Modify User Access Permissions - focuses on changing employee object's role and permission property

  //Employee Repository Class: List of 4 Employee object maps to Employee Abstract class
  //allows you to login as any actor to demonstrate specific use case
  //Employee object containing properties from contact details class
  EmployeeRepository: [
    {
      id: "1",
      name: "Abir",
      role: "HR", //added role property as part of Employee object properties used for the Dashboard and SideBar and ModifyAccess Use case
      email: "abir@fdm.com",
      username: "Abir", //added username and password property as part of Employee object to demo login page
      password: "1234",
      leaveBalance: 20,
      permissions: ["fileShareAccess", "vpnAccess"], //use custom validation logic function to check for enum pairs via .includes()
    },
    {
      id: "2",
      name: "Kymas",
      role: "Employee",
      email: "kymas@fdm.com",
      username: "Kymas",
      password: "1234",
      leaveBalance: 25, //added leaveBalance as part of employee object properties to demo approve annual leave request
      permissions: ["vpnAccess"], //use custom validation logic function to check for enum pairs via .includes()
    },
    {
      id: "3",
      name: "Ley",
      role: "Manager",
      email: "ley@fdm.com",
      username: "Ley",
      password: "1234",
      leaveBalance: 20,
      permissions: ["fileShareAccess"], //use custom validation logic function to check for enum pairs via .includes()
    },
    {
      id: "4",
      name: "Gabriel",
      role: "IT",
      email: "gabriel@fdm.com",
      username: "Gabriel",
      password: "1234",
      leaveBalance: 20,
      permissions: [], //use custom validation logic function to check for enum pairs via .includes()
    },
  ],
  //USE CASES:
  //Submit Employment query - query object created and stored to QueryRepository array
  //Resolve Technical Queries - how is a technical query resolved? via queryStatus from PENDING TO RESOLVED, resolvedBy empID of hr staff, dateResolved, resolutionNote of each object from itQuery array
  //Resolve HR queries

  //QueryRepository class: stores all Query objects added by Create Employment query use case and queries are catergorised by type property of query object
  //repository acts as a collection of the parent Query class
  //Start with prefilled data so app isnt empty everytime we refresh. Remember whatever changes we made on the mock data it is only available during a session. When refreshed all changes will be lost.
  QueryRepository: [
    {
      //HR Query object
      queryID: "1", //queryID shared property name because ITQuery and HRQuery are subclasses of parent Query class.
      empID: "2", //renamed from requestee property in Query class to association with Employee object
      queryType: QueryType.HRQUERY, //HRQuery subclass of Query parent class represented as an enumeration property type
      queryStatus: QueryStatus.PENDING, //Enumeration class for queryStatus renamed rather than 'resolved' boolean value type
      dateRequested: "2026-03-25", //in Javascript standard: YYYY-MM-DD format
      subject: "Benefits Enrollment Question", //new property not added from class diagram
      reason: "When does the open enrollment period start for health benefits?", //new property not added from class diagram
      resolverID: null, //association with ResolvedQuery class. Stores the empID of HR staff from Employee object
      dateResolved: null, //association with ResolvedQuery class.
      resolutionNote: "", //association with ResolvedQuery class: renamed from notes property
    },
    //IT Query object
    {
      queryID: "2",
      empID: "2",
      queryType: QueryType.ITQUERY,
      queryStatus: QueryStatus.PENDING,
      dateRequested: "2026-03-25",
      reason: "Cannot access shared drive",
      resolverID: null,
      dateResolved: null,
      resolutionNote: "",
    },
  ],
  //USE CASES:
  //Employee Submit Annual Leave Request
  //Manager Approve Annual Leave Request: totalDays: (endDate-startDate)+1
  //RQ40 and RQ43
  LeaveRepository: [
    {
      requestID: "1", //NOTICED HOW IS THIS GENERATED EACH TIME?
      empID: "2", //requester is the Employee object which is referenced from the empID. Association with employee object to display their 'Recent Requests'
      startDate: "2026-03-25",
      endDate: "2026-03-29",
      totalDays: 5, //renamed from days property e.g (employee away on 25, 26, 27, 28, 29)
      reason: "Family Vacation",
      leaveStatus: LeaveStatus.PENDING, //property defined by LeaveStatus enunmeration class
      resolverID: null, //requestee property: stores the empID of Manager staff from Employee object after manager clicks resolved and display in 'Recently Processed'
    },
    {
      requestID: "2",
      empID: "2",
      startDate: "2026-01-10",
      endDate: "2026-01-12",
      totalDays: 3, //employee away on 10,11,12
      reason: "Medical Appointment",
      leaveStatus: LeaveStatus.PENDING, //property defined by LeaveStatus enunmeration class
      resolverID: null, //requestee property: stores the empID of Manager staff from Employee object after manager clicks resolved and display in 'Recently Processed'
    },

    {
      requestID: "3",
      empID: "1",
      startDate: "2026-04-12",
      endDate: "2026-04-14",
      totalDays: 3,
      reason: "Personal Matters",
      leaveStatus: LeaveStatus.APPROVED, //property defined by LeaveStatus enunmeration class
      resolverID: "3",
    },

    {
      requestID: "4",
      empID: "4",
      startDate: "2026-04-12",
      endDate: "2026-04-14",
      totalDays: 21,
      reason: "Testing",
      leaveStatus: LeaveStatus.PENDING, //property defined by LeaveStatus enunmeration class
      resolverID: null,
    },
  ],

  //USE CASE
  // HR: Publish internal announcements
  //Class not defined in class diagram to store and immediately made visible to all employees on their home page
  AnnouncementRepository: [
    {
      announcementID: "1",
      empID: "1", //rather than author type, use the id to get the name and role to show who posted
      datePublished: "2026-03-22",
      announcementStatus: AnnouncementStatus.PUBLISHED, //implied audit log instead of actually removing from database
      title: "Q1 Performance Review",
      content:
        "Great work everyone on meeting q1 targets! Let's keep up the momentum.",
    },
  ],
};
