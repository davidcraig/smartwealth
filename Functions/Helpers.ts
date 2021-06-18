/*
Object Helpers
*/

/**
 * Checks if an object has the given property.
 *
 * @param {object} obj Object
 * @param {string} prop Property to check for
 *
 * @returns bool
 */
export function hasProp (obj: object, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/*
Date Helpers
*/

export function getYear (): number {
  const d = new Date()
  return d.getFullYear()
}

export function getMonthsOptionsArray (): Array<any> {
  return [
    { val: 0, name: 'January' },
    { val: 1, name: 'February' },
    { val: 2, name: 'March' },
    { val: 3, name: 'April' },
    { val: 4, name: 'May' },
    { val: 5, name: 'June' },
    { val: 6, name: 'July' },
    { val: 7, name: 'August' },
    { val: 8, name: 'September' },
    { val: 9, name: 'October' },
    { val: 10, name: 'November' },
    { val: 11, name: 'December' }
  ]
}

export function getMonthName (monthIndex: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex]
}
