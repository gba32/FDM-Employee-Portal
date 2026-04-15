
/**
 * Provides a distance metric for a prefix and string. Does not satisfy d(p, s) == d(s, p) unless s === p 
 * @param {string} prefix the prefix that string must start with  
 * @param {string} string the string to find the distance for
 * @returns {number} Infinity if string doesn't have the given prefix, otherwise the number of characters needed to be added to the prefix to get the string
 */
function prefixDistance(prefix, string) {
  if (string.length < prefix.length) {
    return Infinity;
  }

  return string.substring(0, prefix.length) === prefix ? string.length - prefix.length : Infinity;
}


/**
 * A wrapper function providing search filtering for a list of items.
 * 
 * @typedef {object} SearchableListProps
 * @property {string} className the css class to apply to the list
 * @property {string} searchValue the string to filter the list based on
 * @property {Array<*>} items The list of items to display
 * @property {Function} templateFunction A function providing a JSX element for each item
 * @property {Function} nameFunction A function providing a string name for each item
 * @property {Function} keyFunction A function providing unique keys for each item
 * @property {Function} distanceFunction A distance metric for two strings. By default this is the  {@link prefixDistance} metric.
 * 
 * @param {SearchableListProps} props 
 */
export function SearchableList({ className, searchValue, items, templateFunction, placeholderFunction = () => undefined, nameFunction, keyFunction = () => undefined, distanceFunction = prefixDistance, threshold = Infinity, limit = items.length }) {
  // Case insensitive search
  let distances = items.map((item) => distanceFunction(searchValue.toLowerCase(), nameFunction(item).toLowerCase()));
  let components = items
    .filter((_, index) => distances[index] < threshold)
    .map((item, index) => ({ v: item, d: distances[index] }))
    .sort((a, b) => a.d - b.d)
    .map((item) => item.v)

  return <List className={className} keyFunction={keyFunction} items={components} templateFunction={templateFunction} placeholderFunction={placeholderFunction} limit={limit} />;
}

/**
 * A helper function for creating uniform jsx lists from an array of items
 * @typedef {object} ListProps
 * @property {string} className the css class to apply to the list
 * @property {Array<*>} items The list of items to display
 * @property {Function} templateFunction A function providing a JSX element for each item
 * @property {Function} keyFunction A function providing unique keys for each item
 * @property {number} limit The maximum number of items to display
 * 
 * @param {ListProps} props 
 * @returns 
 */
export function List({ className, items, templateFunction, limit, placeholderFunction = () => undefined, keyFunction = () => undefined }) {
  return <ul className={className}>
    { items.length === 0 ? placeholderFunction() : items.map((item) => <li key={keyFunction(item)}>{templateFunction(item)}</li>).slice(0, limit)}
  </ul>
}