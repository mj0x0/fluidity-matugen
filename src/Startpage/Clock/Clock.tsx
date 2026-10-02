import { useEffect, useState } from "react"

import styled from "@emotion/styled"

import * as Settings from "../Settings/settingsHandler"
import { narrowQuery } from "../useNarrow"

const Greeting = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--accent-color);
`

const Time = styled.div`
  font-size: 32px;
  font-weight: 500;
  /* Keeps digits from shifting as they change. */
  font-variant-numeric: tabular-nums;

  @media ${narrowQuery} {
    font-size: 28px;
  }
`

const DateLabel = styled.div`
  font-size: 13px;
  letter-spacing: 0.5px;
  opacity: 0.7;
`

// Fixed in the top-left, mirroring the settings + expand icons on the right.
const ClockContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 24px;
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  color: var(--default-color);
  opacity: 0.5;
  transition: 0.3s;
  user-select: none;

  :hover {
    opacity: 1;

    /* Reuse the same flicker the links use on hover. */
    .clock-time {
      animation: text-flicker 0.01s ease 0s infinite alternate;
    }
  }

  /* Phones: first item of the stacked column instead of a fixed corner. */
  @media ${narrowQuery} {
    position: static;
    align-self: flex-start;
  }
`

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const pad = (value: number) => String(value).padStart(2, "0")

// Boundaries are subjective — tweak the numbers to taste.
const greetingFor = (hour: number) => {
  if (hour < 5) return "Good night" // 00:00 – 04:59
  if (hour < 12) return "Good morning" // 05:00 – 11:59
  if (hour < 17) return "Good afternoon" // 12:00 – 16:59
  if (hour < 21) return "Good evening" // 17:00 – 20:59
  return "Good night" // 21:00 – 23:59
}

export const Clock = () => {
  const [now, setNow] = useState(() => new Date())
  const [settings] = useState(() => Settings.Clock.getWithFallback())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <ClockContainer>
      {settings.showGreeting && <Greeting>{greetingFor(now.getHours())}</Greeting>}
      {settings.showTime && (
        <Time className="clock-time">
          {pad(now.getHours())}:{pad(now.getMinutes())}
        </Time>
      )}
      {settings.showDate && (
        <DateLabel>
          {days[now.getDay()]}, {now.getDate()} {months[now.getMonth()]}
        </DateLabel>
      )}
    </ClockContainer>
  )
}
