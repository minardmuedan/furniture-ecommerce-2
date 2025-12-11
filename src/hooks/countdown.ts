import { useEffect, useState } from 'react'

export const useCountdown = (initialDate?: Date | number) => {
  const [targetDate, setTargetDate] = useState(initialDate)
  const [secondsLeft, setSecondsLeft] = useState(0)

  function calculateSecondsLeft() {
    if (!targetDate) return 0
    const difference = new Date(targetDate).getTime() - Date.now()
    return difference <= 0 ? 0 : Math.floor(difference / 1000)
  }

  useEffect(() => {
    const newSecondsLeft = calculateSecondsLeft()
    setSecondsLeft(newSecondsLeft)

    if (newSecondsLeft <= 0) return

    const intervalId = setInterval(() => {
      const remaining = calculateSecondsLeft()
      setSecondsLeft(remaining)

      if (remaining <= 0) clearInterval(intervalId)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDate])

  return { secondsLeft, setTargetDate }
}
