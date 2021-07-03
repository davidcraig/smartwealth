import React from "react"

/**
 * Formats a number as a decimal
 * @param {*} string Number to be formatted.
 * @returns string
 */
export function FormattedDecimal (number: string | number, decimalPlaces: number = 2): JSX.Element {
  if (typeof number === 'undefined') { return null }
  if (number === null) { return null }

  if (typeof number === 'number') {
    number = number.toFixed(decimalPlaces)
  }

  if (number === '') {
    return (
      <span className='decimal'>
        0
      </span>
    )
  }

  const parts = number.split('.')
  const whole = parseInt(parts[0])

  if (parts.length === 1) {
    return (
      <span className='decimal'>
        {whole}
      </span>
    )
  }

  const decimal = parseInt(parts[1]) || 0

  if (decimal === 0) {
    return (
      <span className='decimal'>
        {whole}
      </span>
    )
  }

  return (
    <span className='decimal'>
      {whole}.<span style={{ fontSize: '0.8em' }}>{decimal}</span>
    </span>
  )
}

export default FormattedDecimal
