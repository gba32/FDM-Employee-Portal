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

function PermissionCheckBox(permission) {
  return <>
    <label name={permission.name}/>
    <input type="checkbox" checked={permission.enabled} disabled={permission.editable ? undefined : "disabled"} />
  </>
}

function PermissionBar({ permissions, }) {
  return (<List items={permissions} template={PermissionCheckBox} />);
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function SearchBar({ className, hint, onValueChanged }) {
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
 * @param {*} param0 
 */
function EmployeeCard({ className, employee }) {
  return <article className={className}>
    <header>
      <h4>{employee.name}</h4>
      <h5>{employee.email}</h5>
    </header>
    <PermissionBar permissions={employee.permissions.map((p) => new Permission(p, true, false))} />
  </article>
}

function prefixDistance(prefix, string) {
  if (string.length < prefix.length) {
    return -1;
  }

  return string.substring(0, prefix.length) === prefix ? string.length - prefix.length : -1;
}

/**
 * 
 * @param {*} param0 
 */
function SearchableList({ className, searchValue, items, template, nameFunction, distanceFunc = prefixDistance, threshold = 0, limit = items.length }) {
  let distances = items.map((item) => distanceFunc(searchValue, nameFunction(item)));
  let components = items
    .filter((_, index) => distances[index] >= threshold)
    .map((item, index) => ({ v: item, d: distances[index] }))
    .sort((a, b) => a.d - b.d)
    .map((item) => item.v)


  return <List className={className} items={components} template={template} limit={limit} />;
}

function List({ className, items, template, limit }) {
  return <ul className={className}>
    {items.map((item) => template(item)).slice(0, limit)}
  </ul>
}

//PLEASE READ THIS BEFORE IMPLEMENTING: toggle permissions or Role type(changing role type is the same as giving admin rights so no need to have a
// ..checkbox and instead implement a dropdown menu)
const ModifyAccess = ({ repository, setRepository, user }) => {
  let [searchValue, setSearchValue] = useState("");

  if (!user) {
    return <p>Loading user data</p>
  }


  return (
    <section className="ModifyAccessContainer">
      <h2>User Access Permissions</h2>
      <h3>Manage user access and permissions across systems</h3>
      <SearchBar
        className="searchBar"
        hint="Search users..."
        onValueChanged={(newValue) => { setSearchValue(newValue) }} />

      <SearchableList
        className="cardContainer"
        searchValue={searchValue}
        items={repository}
        template={(item) => <EmployeeCard employee={item} className="employeeCard" />}
        nameFunction={(item) => item.name} limit={2} />
    </section>
  );
};
export default ModifyAccess;
