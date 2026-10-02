import { useSyncExternalStore } from "react"

export const narrowQuery = "(max-width: 768px)"

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(narrowQuery)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export const useNarrow = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(narrowQuery).matches)
