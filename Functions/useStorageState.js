/* globals localStorage */
import { useState, useEffect } from 'react'

export function useStorageState (initialValue, storageKey) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch (error) { // If error also return initialValue
      console.warn(error)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(value))
    }
  }, [value])

  return [value, setValue]
}

export default useStorageState
