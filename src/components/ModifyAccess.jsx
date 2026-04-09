import { useEffect, useRef, useState } from "react";
import "../css/ModifyAccess.css";
import { PermissionsType } from "../services/mockPortalData";

class Permission {
  constructor(name, enabled, editable) {
    this.name = name;
    this.enabled = enabled;
    this.editable = editable;
  }
}

function PermissionCheckBox(permission, onPermissionChanged = () => {}) {
  return <>
    <input type="checkbox" checked={permission.enabled} disabled={permission.editable} onChange={(event) => onPermissionChanged(permission, event.target.checked)} />
    <label>{permission.name}</label>
  </>
}

function PermissionBar({ permissions, onPermissionChanged = () => {} }) {
  return (<List className="permissionBar" items={permissions} template={(p) => PermissionCheckBox(p, onPermissionChanged)} />);
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function SearchBar({ className, hint, onValueChanged = () => {} }) {
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

function EmployeePFP({ className, employee }) {
  return employee.logo === undefined ? <svg className={className} height={48} width={48} >
    <circle r={24} cx={24} cy={24} fill="#C5FF00" />
    <text textAnchor="middle" x={24} y={28} fontSize={16}>{employee.name[0]}</text>
  </svg> : undefined; // Need to add something incase they have an actual pfp
}

/**
 * 
 * @param {*} param0 
 */
function EmployeeCard({ className, employee, permissions, onPermissionsChanged = (newPermissions) => {} }) {
  let permissionMap = permissions.map((p) => { return { p: p, enabled: employee.permissions.includes(p) } });
  let [permissionState, setPermissionState] = useState(permissionMap.map((v) => new Permission(v.p, v.enabled, false)));
  return <article className={className}>
    <header>
      <EmployeePFP employee={employee} />
      <div className="employeeDetails">
        <h4>{employee.name}</h4>
        <h6>{employee.email}</h6>
      </div>
    </header>
    <PermissionBar permissions={permissionState} onPermissionChanged={
      (permission, newValue) => {
        let newPermissions = permissionState.map((p) => p === permission ? new Permission(p.name, newValue, p.editable) : p);
        setPermissionState(newPermissions)
        onPermissionsChanged(newPermissions);
      }
    } />
  </article>
}

function prefixDistance(prefix, string) {
  if (string.length < prefix.length) {
    return Infinity;
  }

  return string.substring(0, prefix.length) === prefix ? string.length - prefix.length : Infinity;
}

/**
 * 
 * @param {*} param0 
 */
function SearchableList({ className, searchValue, items, template, nameFunction, distanceFunc = prefixDistance, threshold = Infinity, limit = items.length }) {
  let distances = items.map((item) => distanceFunc(searchValue.toLowerCase(), nameFunction(item).toLowerCase()));
  let components = items
    .filter((_, index) => distances[index] < threshold)
    .map((item, index) => ({ v: item, d: distances[index] }))
    .sort((a, b) => a.d - b.d)
    .map((item) => item.v)

  return <List className={className} items={components} template={template} limit={limit} />;
}

function List({ className, items, template, limit }) {
  return <ul className={className}>
    {items.map((item) => <li>{template(item)}</li>).slice(0, limit)}
  </ul>
}

//PLEASE READ THIS BEFORE IMPLEMENTING: toggle permissions or Role type(changing role type is the same as giving admin rights so no need to have a
// ..checkbox and instead implement a dropdown menu)
const ModifyAccess = ({ repository, setRepository, user }) => {
  let [searchValue, setSearchValue] = useState("");
  let permissions = Object.values(PermissionsType);
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
        template={(item) => <EmployeeCard 
          employee={item} 
          permissions={permissions}
          className="employeeCard" 
          onPermissionsChanged={(newPermissions) => {updatePermissions(item, newPermissions.filter((p) => p.enabled).map((p) => p.name)) }} />}
        nameFunction={(item) => item.name} limit={2} />
    </section>
  );
};
export default ModifyAccess;
