//Enumeration class for queryStatus rather than a 'resolved' boolean value type in Query Class
export const QueryStatus = Object.freeze({
  //using filter()
  PENDING: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected", //Although not stated in the class diagram, HR OR IT staff can deny a request
});

//Enumeration class for QueryType based on class diagram
export const QueryType = Object.freeze({
  HRQUERY: "HR Query",
  ITQUERY: "IT Query",
});

//mock data = Repository class
export const mockData = {
  //List of 4 users maps to Employee Abstract class
  //allows you to login as any actor to demonstrate specific use case
  //Acts as the Employee Detail class where contact details class is part of the employee details class.
  users: [
    {
      id: "U101",
      name: "Abir",
      role: "HR",
      email: "abir@fdm.com",
      username: "Abir",
      password: "1234",
    }, //add balance
    {
      id: "U102",
      name: "Kymas",
      role: "Employee",
      email: "kymas@fdm.com",
      username: "Kymas",
      password: "1234",
    },
    {
      id: "U103",
      name: "Ley",
      role: "Manager",
      email: "ley@fdm.com",
      username: "Ley",
      password: "1234",
    },
    {
      id: "U104",
      name: "Gabriel",
      role: "IT",
      email: "gabriel@fdm.com",
      username: "Gabriel",
      password: "1234",
    },
  ],

  //Submit Employment query - //how is a query created and stored to array
  //SECURITY REQUIREMENTS: if user logged in user role is HR or IT before resolving queries
  //Resolve Technical Queries - how is a technical query resolved? via queryStatus from PENDING TO RESOLVED, resolvedBy uID of hr staff, dateResolved, resolutionNote of each object from itQuery array
  //Resolve HR queries

  //query repository that stores all added by Create Employment query use case and queries are catergorised by type property of query object
  //repository acts as a collection of the parent Query class
  //start with prefilled data so app isnt empty everytime we refresh. Remember whatever changes we made on the mock data it is only available during a session. When refreshed all changes will be lost.
  initialQueries: [
    //queryID shared property name because ITQuery and HRQuery are subclasses of parent Query class.
    {
      queryID: "Q001",
      uID: "U102",
      queryType: QueryType.HRQUERY,
      queryStatus: QueryStatus.PENDING,
      dateRequested: "2026-03-25",
      subject: "Benefits Enrollment Question",
      reason: "When does the open enrollment period start for health benefits?",
      resolvedBy: null,
      dateResolved: null,
      resolutionNote: "",
    },
    {
      queryID: "Q002",
      uID: "U102",
      queryType: QueryType.ITQUERY,
      queryStatus: QueryStatus.PENDING,
      dateRequested: "2026-03-25",
      reason: "Cannot access shared drive",
      resolvedBy: null,
      dateResolved: null,
      resolutionNote: "",
    },
  ],

  //Employee Submit Annual Leave Request
  //Manager Approve Annual Leave Request
  //RQ40 and RQ43
  // leaveRequests: [
  //   {
  //     id: "LR_001",
  //     requestID: "U102",
  //     name: "Kymas",
  //     startDate: "Mar 25",
  //     endDate: "Mar 29",
  //     year: "2026",
  //     reason: "Family Vacation",
  //     status: "Pending",
  //   }, //Pending->Rejected
  //   {
  //     id: "LR_001",
  //     requestID: "U102",
  //     name: "Kymas",
  //     startDate: "Feb 14",
  //     endDate: "Feb 16",
  //     year: "2026",
  //     reason: "Personal Matters",
  //     status: "Approved",
  //   },
  //   {
  //     id: "LR_001",
  //     requestID: "U102",
  //     name: "Kymas",
  //     startDate: "Jan 10",
  //     endDate: "Jan 12",
  //     year: "2026",
  //     reason: "Medical Appointment",
  //     status: "Pending",
  //   }, //Pending->Approved
  // ],

  //Modify User Access Permissions

  //Publish internal announcements
};
