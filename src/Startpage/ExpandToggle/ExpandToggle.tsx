import styled from "@emotion/styled"
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { narrowQuery } from "../useNarrow"

// Sits just left of the settings gear (which lives at right: 20px).
const ExpandToggleButton = styled.button<{ active: boolean }>`
  position: fixed;
  top: 20px;
  right: 56px;
  font-size: 20px;

  color: var(--default-color);
  background-color: transparent;
  border: none;
  opacity: ${({ active }) => (active ? 0.6 : 0.3)};

  cursor: pointer;
  transition: 0.3s;

  /* Reuse the existing circling-shadow-small keyframes while expanded. */
  ${({ active }) =>
    active && "animation: circling-shadow-small 4s ease 0s infinite normal;"}

  :hover {
    opacity: 0.5;
    color: var(--accent-color2);
    animation: box-flicker 0.01s ease 0s infinite alternate;
  }
  :focus {
    outline: none;
  }

  @media ${narrowQuery} {
    top: 6px;
    right: 54px;
    padding: 12px;
  }
`

type props = {
  active: boolean
  onToggle: () => void
}

export const ExpandToggle = ({ active, onToggle }: props) => (
  <ExpandToggleButton
    active={active}
    onClick={onToggle}
    title={active ? "Collapse groups" : "Expand all groups"}
    aria-label={active ? "Collapse groups" : "Expand all groups"}
  >
    <FontAwesomeIcon icon={active ? faCompress : faExpand} />
  </ExpandToggleButton>
)
