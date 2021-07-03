/* globals localStorage */
import React, { useState, useEffect } from 'react'

export function useStorageState (initialValue, storageKey) {
  if (typeof window !== 'undefined') {
    // Set up our state, checking if localStorage exists and populating with that
    const [value, setValue] = useState(() => {
      const stored = localStorage.getItem(storageKey)
      try {
        return stored ? JSON.parse(stored) : initialValue
      } catch (error) {
        // If error also return initialValue
        console.warn(error)
        return initialValue
      }
    })

    // Update localStorage whenever the value is changed
    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }, [value])

    return [value, setValue]
  }

  return useState(initialValue)
}

export default useStorageState
