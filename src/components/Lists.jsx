
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