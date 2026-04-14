import { useContext, useEffect, useRef, useState } from "react";
import "../css/ModifyAccess.css";
import "../css/Toast.css";
import { PermissionsType } from "../services/mockPortalData";
import { SearchableList, List } from "./Lists";
import { showText, ToastContainer, ToastContext } from "./Toast";

class PermissionState {
  /**
   * 
   * @param {string} name 
   * @param {boolean} enabled 
   * @param {boolean} editable 
   */
  constructor(name, enabled, editable) {
    this.name = name;
    this.enabled = enabled;
    this.editable = editable;
  }
}

class EmployeeRepository {
  /**
   * 
   * @param {Array<*>} employeeData 
   * @param {Function} setEmployeeData 
   */
  constructor(employeeData, setEmployeeData) {
    this.employeeData = employeeData;
    this.setEmployeeData = setEmployeeData;
  }

  /**
   * Gets an employee from the data store
   * @param {string} employeeId 
   * @returns 
   */
  getEmployeeById(employeeId) {
    let employee = this.employeeData.find((item) => item.id === employeeId);
    return employee !== undefined ? employee : null;
  }

  /**
   * Sets the permissions for an employee in the data store
   * @param {string} employeeId 
   * @param {Array<PermissionState>} permissionStates 
   */
  setEmployeePermissions(employeeId, permissionStates) {
    let employee = this.getEmployeeById(employeeId);
    if (employee !== null) {
      employee.permissions = permissionStates.filter((p) => p.enabled).map((p) => p.name);
      this.setEmployeeData(this.employeeData);
    }
  }
}


class PermissionManager {
  /**
   * 
   * @param {Array<string>} permissionList complete list of available permissions
   * @param {EmployeeRepository} employeeRepository 
   */
  constructor(permissionList, employeeRepository) {
    this.permissionList = permissionList;
    this.employeeRepository = employeeRepository
  }

  /**
   * 
   * @param {string} employeeId 
   * @returns 
   */
  getPermissionStates(employeeId) {
    let employee = this.employeeRepository.getEmployeeById(employeeId);

    if (employee === undefined) {
      return null;
    }

    let permissionMap = this.permissionList.map((p) => { return { name: p, enabled: employee.permissions.includes(p) } });
    return permissionMap.map((p) => new PermissionState(p.name, p.enabled, false))
  }

  /**
   * 
   * @param {string} employeeId 
   * @param {Array<PermissionState>} permissionStates 
   */
  setPermissions(employeeId, permissionStates) {
    this.employeeRepository.setEmployeePermissions(employeeId, permissionStates);
  }
}


/**
 * @param {PermissionState} permission 
 * @callback onPermissionChanged 
 * @returns 
 */
function PermissionCheckBox(permission, onPermissionChanged = (permission, checked) => { }) {
  return <>
    <input type="checkbox" checked={permission.enabled} disabled={permission.editable} onChange={(event) => onPermissionChanged(permission, event.target.checked)} />
    <label>{permission.name}</label>
  </>
}

/**
 * @typedef PermissionBarProps
 * 
 * @param {*} param0 
 * @returns 
 */
function PermissionBar({ permissions, onPermissionChanged = () => { } }) {
  return (<List className="permissionBar" items={permissions} templateFunction={(p) => PermissionCheckBox(p, onPermissionChanged)} />);
}

/**
 * @typedef SearchBarProps
 * @property {string} className
 * @property {string} hint
 * @property {Function} 
 * 
 * @param {*} param0 
 * @returns 
 */
function SearchBar({ className, hint, onValueChanged = () => { } }) {
  const searchRef = useRef(null);
  useEffect(() => {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          onValueChanged(mutation.target.value);
        }
      })
    });
    observer.observe(searchRef.current, { attributes: true });
  });

  return (<form >
    <input className={className} placeholder={hint} ref={searchRef} type="text" />
  </form>);
}

/**
 * 
 * @param {*} props
 * @param {string} props.className The CSS class to style the pfp with
 * @param {*} employee The employee to display the PFP for.
 * @returns 
 */
function EmployeePFP({ className, employee }) {
  return employee.logo === undefined ? <svg className={className} height={48} width={48} >
    <circle r={24} cx={24} cy={24} fill="#C5FF00" />
    <text textAnchor="middle" x={24} y={28} fontSize={16}>{employee.name[0]}</text>
  </svg> : undefined; // Need to add something incase they have an actual pfp
}

/**
 * @typedef {object} EmployeeCardProps
 * @property {string} className 
 * @property {object} employee
 * @property {Array} permissions
 * 
 * @param {EmployeeCardProps} props
 */
function EmployeeCard({ className, employee, permissionManager, onPermissionsChanged = (newPermissions) => { } }) {
  const context = useContext(ToastContext);
  const DELAY = 1000;
  let [permissionState, setPermissionState] = useState(permissionManager.getPermissionStates(employee.id));
  const updatePermissionState = (permission, newValue) => {
    // Copy the current permissions and edit only the affected one.
    let newPermissions = permissionState.map((p) => p === permission ? new PermissionState(p.name, newValue, p.editable) : p);
    setPermissionState(newPermissions)
  }

  return <article className={className}>
    <header>
      <EmployeePFP employee={employee} />
      <div className="employeeDetails">
        <h4>{employee.name}</h4>
        <h6>{employee.email}</h6>
      </div>
    </header>
    <PermissionBar permissions={permissionState} onPermissionChanged={updatePermissionState} />
    <div className="saveBar">
      <button onClick={() => { 
        showText("Saved!", DELAY, context);
        onPermissionsChanged(permissionState)
       }}>Save changes</button>
    </div>
  </article>
}

//PLEASE READ THIS BEFORE IMPLEMENTING: toggle permissions or Role type(changing role type is the same as giving admin rights so no need to have a
// ..checkbox and instead implement a dropdown menu)

/**
 * @typedef {object} ModifyAccessProps
 * 
 * @param {*} param0 
 * @returns 
 */
const ModifyAccess = ({ repository, setRepository, user }) => {
  const permissionList = Object.values(PermissionsType);
  const LIMIT = 100;
  let [searchValue, setSearchValue] = useState("");
  let employeeRepository = new EmployeeRepository(repository, setRepository);
  let permissionManager = new PermissionManager(permissionList, employeeRepository);

  if (!user) {
    return <p>Loading user data</p>
  }

  return (
    <ToastContainer limit={5} containerClass="toastContainer" toastClass="toast">
      <section className="ModifyAccessContainer">
        <h2>User Access Permissions</h2>
        <h5>Manage user access and permissions across systems</h5>
        <SearchBar
          className="searchBar"
          hint="Search users..."
          onValueChanged={(newValue) => { setSearchValue(newValue) }} />

        <SearchableList
          className="cardContainer"
          searchValue={searchValue}
          items={repository}
          templateFunction={(item) => <EmployeeCard
            employee={item}
            permissions={permissionList}
            className="employeeCard"
            permissionManager={permissionManager}
            onPermissionsChanged={(newPermissions) => {
              permissionManager.setPermissions(item.id, newPermissions);
            }} />}
          placeholderFunction={() => <p>No employees found.</p>}
          nameFunction={(item) => item.name} limit={LIMIT}

          keyFunction={(item) => item.id} />
      </section>
    </ToastContainer>
  );
};

export default ModifyAccess;
