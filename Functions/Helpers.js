/**
 * Checks if an object has the given property.
 *
 * @param {object} obj Object
 * @param {string} prop Property to check for
 *
 * @returns bool
 */
export function hasProp (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export default {
  hasProp
}
