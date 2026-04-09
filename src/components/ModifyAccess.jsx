import { useEffect, useRef, useState } from "react";
import "../css/ModifyAccess.css";
import { PermissionsType } from "../services/mockPortalData";

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
   * @param {Array} employeeData 
   * @param {Function} setEmployeeData 
   */
  constructor(employeeData, setEmployeeData) {
    this.employeeData = employeeData;
    this.setEmployeeData = setEmployeeData;
  }

  /**
   * 
   * @param {*} employeeId 
   * @returns 
   */
  getEmployeeById(employeeId) {
    let employee = this.employeeData.find((item) => item.id === employeeId);
    return employee !== undefined ? employee : null;
  }

  /**
   * 
   * @param {*} employeeId 
   * @param {*} permissionStates 
   */
  setEmployeePermissions(employeeId, permissionStates) {
    let employee = this.getEmployeeById(employeeId);
    if(employee !== null) {
      employee.permissions = permissionStates.filter((p) => p.enabled).map((p) => p.name);
      console.log(this.employeeData);
      this.setEmployeeData(this.employeeData);
      console.log(this.employeeData);
    }
  }
}


class PermissionManager {
  /**
   * 
   * @param {Array<string>} permissionList 
   * @param {EmployeeRepository} employeeRepository 
   */
  constructor(permissionList, employeeRepository) {
    this.permissionList = permissionList;
    this.employeeRepository = employeeRepository
  }

  /**
   * 
   * @param {*} employeeId 
   * @returns 
   */
  getPermissionStates(employeeId) {
    let employee = this.employeeRepository.getEmployeeById(employeeId);

    if(employee === undefined) {
      return null;
    }

    let permissionMap = this.permissionList.map((p) => { return { name: p, enabled: employee.permissions.includes(p) } });
    return permissionMap.map((p) => new PermissionState(p.name, p.enabled, false))
  }

  /**
   * 
   * @param {*} employeeId 
   * @param {*} permissionStates 
   */
  setPermissions(employeeId, permissionStates) {
    this.employeeRepository.setEmployeePermissions(employeeId, permissionStates);
  }
}


/**
 * 
 * @param {*} permission 
 * @param {*} onPermissionChanged 
 * @returns 
 */
function PermissionCheckBox(permission, onPermissionChanged = () => { }) {
  return <>
    <input type="checkbox" checked={permission.enabled} disabled={permission.editable} onChange={(event) => onPermissionChanged(permission, event.target.checked)} />
    <label>{permission.name}</label>
  </>
}

function PermissionBar({ permissions, onPermissionChanged = () => { } }) {
  return (<List className="permissionBar" items={permissions} templateFunction={(p) => PermissionCheckBox(p, onPermissionChanged)} />);
}

/**
 * @typedef 
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
      <button onClick={() => { onPermissionsChanged(permissionState) }}>Save changes</button>
    </div>
  </article>
}

/**
 * Provides a distance metric for a prefix and string. Does not satisfy d(p, s) == d(s, p) unless s === p 
 * @param {string} prefix the prefix that string must start with  
 * @param {string} string the string to find the distance for
 * @returns {number} Infinity if string doesn't have the given prefix,
 * otherwise the number of characters needed to be added to the prefix to get the string
 */
function prefixDistance(prefix, string) {
  if (string.length < prefix.length) {
    return Infinity;
  }

  return string.substring(0, prefix.length) === prefix ? string.length - prefix.length : Infinity;
}

/**
 * @typedef {object} SearchableListProps
 * @property {string} props.className
 * @property {string} props.searchValue
 * @property {*} props.items
 * @property {Function} props.templateFunction
 * @property {Function} props.nameFunction
 * @property {Function} props.keyFunction
 * @property {Function} props.distanceFunction
 * 
 * @param {SearchableListProps} props
 */
function SearchableList({ className, searchValue, items, templateFunction, nameFunction, keyFunction = () => undefined, distanceFunction = prefixDistance, threshold = Infinity, limit = items.length }) {
  // Case insensitive search
  let distances = items.map((item) => distanceFunction(searchValue.toLowerCase(), nameFunction(item).toLowerCase()));
  let components = items
    .filter((_, index) => distances[index] < threshold)
    .map((item, index) => ({ v: item, d: distances[index] }))
    .sort((a, b) => a.d - b.d)
    .map((item) => item.v)

  return <List className={className} keyFunction={keyFunction} items={components} templateFunction={templateFunction} limit={limit} />;
}

/**
 * @typedef {object} ListProps
 * @property {string} props.className
 * @property {string} props.searchValue
 * @property {*} props.items
 * @property {Function} props.templateFunction
 * @property {Function} props.keyFunction
 * @property {number} limit
 * 
 * @param {ListProps} param0 
 * @returns 
 */
function List({ className, items, templateFunction, limit, keyFunction = () => undefined }) {
  return <ul className={className}>
    {items.map((item) => <li key={keyFunction(item)}>{templateFunction(item)}</li>).slice(0, limit)}
  </ul>
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
  let [searchValue, setSearchValue] = useState("");
  let employeeRepository = new EmployeeRepository(repository, setRepository);
  let permissionManager = new PermissionManager(permissionList, employeeRepository);
  
  if (!user) {
    return <p>Loading user data</p> 
  }

  const updatePermissions = (employee, permissions) => {
    console.log(repository);
    // hackish way to update repo
    employee.permissions = permissions;
    setRepository(repository);
  };


  return (
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
          permissionManager = {permissionManager}
          onPermissionsChanged={(newPermissions) => { 
            permissionManager.setPermissions(item.id, newPermissions);
          }} />}
        nameFunction={(item) => item.name} limit={3}
        keyFunction={(item) => item.id} />
    </section>
  );
};

export default ModifyAccess;
